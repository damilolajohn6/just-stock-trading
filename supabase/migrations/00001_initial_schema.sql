-- ============================================
-- Just Stock Trading DATABASE SCHEMA
-- ============================================
-- Version: 1.0.0
-- Description: Complete database schema for Just Stock Trading
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- CUSTOM TYPES (ENUMS)
-- ============================================

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Product condition
CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair');

-- Weight units
CREATE TYPE weight_unit AS ENUM ('kg', 'lb', 'g', 'oz');

-- Order status
CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Payment provider
CREATE TYPE payment_provider AS ENUM ('stripe', 'paystack');

-- Coupon type
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed', 'free_shipping');

-- ============================================
-- TABLE: profiles
-- Extends Supabase auth.users
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- TABLE: categories
-- Product categories with hierarchical support
-- ============================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_categories_sort ON categories(sort_order);

-- ============================================
-- TABLE: products
-- Main products table
-- ============================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  brand TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price DECIMAL(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  cost_price DECIMAL(10,2) CHECK (cost_price IS NULL OR cost_price >= 0),
  sku TEXT UNIQUE,
  barcode TEXT,
  weight DECIMAL(10,2) CHECK (weight IS NULL OR weight >= 0),
  weight_unit weight_unit DEFAULT 'kg',
  condition product_condition DEFAULT 'good' NOT NULL,
  material TEXT,
  color TEXT,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  is_trending BOOLEAN DEFAULT FALSE NOT NULL,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_published ON products(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_trending ON products(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_condition ON products(condition);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Full-text search index
CREATE INDEX idx_products_search ON products 
USING GIN(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(brand, '')));

-- ============================================
-- TABLE: product_images
-- Product images with Cloudinary
-- ============================================

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  public_id TEXT NOT NULL,
  alt_text TEXT,
  width INTEGER,
  height INTEGER,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);

-- ============================================
-- TABLE: product_variants
-- Size/color variants with stock
-- ============================================

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT,
  sku TEXT UNIQUE,
  price_adjustment DECIMAL(10,2) DEFAULT 0 NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint for product + size + color combination
  UNIQUE(product_id, size, color)
);

-- Indexes
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_size ON product_variants(size);
CREATE INDEX idx_product_variants_available ON product_variants(is_available) WHERE is_available = TRUE;
CREATE INDEX idx_product_variants_stock ON product_variants(stock_quantity);

-- ============================================
-- TABLE: addresses
-- User shipping/billing addresses
-- ============================================

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'GB' NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  is_billing BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = TRUE;

-- ============================================
-- TABLE: cart_items
-- Shopping cart items
-- ============================================

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint for user + product + variant combination
  UNIQUE(user_id, product_id, variant_id)
);

-- Indexes
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- ============================================
-- TABLE: wishlists
-- User wishlists
-- ============================================

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_product ON wishlists(product_id);

-- ============================================
-- TABLE: coupons
-- Discount coupons
-- ============================================

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  type coupon_type NOT NULL,
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  min_purchase DECIMAL(10,2) CHECK (min_purchase IS NULL OR min_purchase >= 0),
  max_discount DECIMAL(10,2) CHECK (max_discount IS NULL OR max_discount >= 0),
  max_uses INTEGER,
  max_uses_per_user INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0 NOT NULL,
  applies_to_categories UUID[] DEFAULT '{}',
  applies_to_products UUID[] DEFAULT '{}',
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active, starts_at, expires_at);

-- ============================================
-- TABLE: coupon_usage
-- Track coupon usage per user
-- ============================================

CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID, -- Will reference orders table
  used_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Index for checking user usage
  UNIQUE(coupon_id, user_id, order_id)
);

CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

-- ============================================
-- TABLE: orders
-- Customer orders
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status order_status DEFAULT 'pending' NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  payment_method payment_provider NOT NULL,
  payment_id TEXT,
  payment_intent_id TEXT,
  
  -- Pricing
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (shipping_cost >= 0),
  tax DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (tax >= 0),
  discount DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (discount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  currency TEXT DEFAULT 'GBP' NOT NULL,
  
  -- Addresses (stored as JSONB for historical accuracy)
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  
  -- Shipping
  shipping_method TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  
  -- Additional info
  notes TEXT,
  internal_notes TEXT,
  coupon_code TEXT,
  coupon_discount DECIMAL(10,2) DEFAULT 0,
  
  -- Timestamps
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_payment_id ON orders(payment_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Update coupon_usage to reference orders
ALTER TABLE coupon_usage 
  ADD CONSTRAINT fk_coupon_usage_order 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- ============================================
-- TABLE: order_items
-- Items within an order
-- ============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  
  -- Product snapshot for historical accuracy
  product_snapshot JSONB NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ============================================
-- TABLE: reviews
-- Product reviews
-- ============================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  helpful_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- One review per user per product
  UNIQUE(product_id, user_id)
);

-- Indexes
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;
CREATE INDEX idx_reviews_rating ON reviews(product_id, rating);

-- ============================================
-- TABLE: flash_sales
-- Flash sale events
-- ============================================

CREATE TABLE flash_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  banner_image TEXT,
  discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CHECK (ends_at > starts_at)
);

-- Indexes
CREATE INDEX idx_flash_sales_active ON flash_sales(is_active, starts_at, ends_at);
CREATE INDEX idx_flash_sales_slug ON flash_sales(slug);

-- ============================================
-- TABLE: flash_sale_products
-- Products in flash sales
-- ============================================

CREATE TABLE flash_sale_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flash_sale_id UUID NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sale_price DECIMAL(10,2) CHECK (sale_price IS NULL OR sale_price >= 0),
  max_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(flash_sale_id, product_id)
);

-- Indexes
CREATE INDEX idx_flash_sale_products_sale ON flash_sale_products(flash_sale_id);
CREATE INDEX idx_flash_sale_products_product ON flash_sale_products(product_id);

-- ============================================
-- TABLE: newsletter_subscribers
-- Email newsletter subscriptions
-- ============================================

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  is_subscribed BOOLEAN DEFAULT TRUE NOT NULL,
  source TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  unsubscribed_at TIMESTAMPTZ,
  
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribed ON newsletter_subscribers(is_subscribed) WHERE is_subscribed = TRUE;

-- ============================================
-- TABLE: recently_viewed
-- Recently viewed products per user
-- ============================================

CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);

-- ============================================
-- TABLE: inventory_logs
-- Track inventory changes
-- ============================================

CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  change_quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT, -- 'order', 'manual', 'return', etc.
  reference_id UUID,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);
CREATE INDEX idx_inventory_logs_variant ON inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_created ON inventory_logs(created_at DESC);

-- ============================================
-- TABLE: admin_activity_logs
-- Track admin actions
-- ============================================

CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_entity ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created ON admin_activity_logs(created_at DESC);

-- ============================================
-- TABLE: page_views
-- Analytics: page views
-- ============================================

CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes (partitioned by date for performance)
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_user ON page_views(user_id) WHERE user_id IS NOT NULL;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  timestamp_part := UPPER(TO_CHAR(NOW(), 'YYMMDDHH24MI'));
  random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
  RETURN 'TF-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'email_verified')::boolean, FALSE)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update product view count
CREATE OR REPLACE FUNCTION increment_product_view(product_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET view_count = view_count + 1 
  WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate product stock status
CREATE OR REPLACE FUNCTION get_product_stock_status(product_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  total_stock INTEGER;
  low_threshold INTEGER := 5;
BEGIN
  SELECT COALESCE(SUM(stock_quantity), 0) INTO total_stock
  FROM product_variants
  WHERE product_id = product_uuid AND is_available = TRUE;
  
  IF total_stock = 0 THEN
    RETURN 'out_of_stock';
  ELSIF total_stock <= low_threshold THEN
    RETURN 'low_stock';
  ELSE
    RETURN 'in_stock';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory and log changes
CREATE OR REPLACE FUNCTION update_inventory(
  p_variant_id UUID,
  p_quantity_change INTEGER,
  p_reason TEXT,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_product_id UUID;
  v_previous_qty INTEGER;
  v_new_qty INTEGER;
BEGIN
  -- Get current values
  SELECT product_id, stock_quantity 
  INTO v_product_id, v_previous_qty
  FROM product_variants
  WHERE id = p_variant_id
  FOR UPDATE;
  
  -- Calculate new quantity
  v_new_qty := GREATEST(0, v_previous_qty + p_quantity_change);
  
  -- Update variant stock
  UPDATE product_variants
  SET stock_quantity = v_new_qty,
      updated_at = NOW()
  WHERE id = p_variant_id;
  
  -- Log the change
  INSERT INTO inventory_logs (
    product_id, variant_id, previous_quantity, new_quantity, 
    change_quantity, reason, reference_type, reference_id, created_by
  ) VALUES (
    v_product_id, p_variant_id, v_previous_qty, v_new_qty,
    p_quantity_change, p_reason, p_reference_type, p_reference_id, p_created_by
  );
END;
$$ LANGUAGE plpgsql;

-- Function to validate coupon
CREATE OR REPLACE FUNCTION validate_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_subtotal DECIMAL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  coupon_id UUID,
  discount_amount DECIMAL,
  error_message TEXT
) AS $$
DECLARE
  v_coupon RECORD;
  v_user_usage_count INTEGER;
  v_discount DECIMAL;
BEGIN
  -- Find coupon
  SELECT * INTO v_coupon
  FROM coupons
  WHERE UPPER(code) = UPPER(p_code)
    AND is_active = TRUE;
    
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Invalid coupon code';
    RETURN;
  END IF;
  
  -- Check dates
  IF v_coupon.starts_at IS NOT NULL AND v_coupon.starts_at > NOW() THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Coupon is not yet active';
    RETURN;
  END IF;
  
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Coupon has expired';
    RETURN;
  END IF;
  
  -- Check max uses
  IF v_coupon.max_uses IS NOT NULL AND v_coupon.used_count >= v_coupon.max_uses THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'Coupon usage limit reached';
    RETURN;
  END IF;
  
  -- Check user usage
  SELECT COUNT(*) INTO v_user_usage_count
  FROM coupon_usage
  WHERE coupon_id = v_coupon.id AND user_id = p_user_id;
  
  IF v_coupon.max_uses_per_user IS NOT NULL AND v_user_usage_count >= v_coupon.max_uses_per_user THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 'You have already used this coupon';
    RETURN;
  END IF;
  
  -- Check minimum purchase
  IF v_coupon.min_purchase IS NOT NULL AND p_subtotal < v_coupon.min_purchase THEN
    RETURN QUERY SELECT FALSE, NULL::UUID, 0::DECIMAL, 
      'Minimum purchase of £' || v_coupon.min_purchase || ' required';
    RETURN;
  END IF;
  
  -- Calculate discount
  CASE v_coupon.type
    WHEN 'percentage' THEN
      v_discount := p_subtotal * (v_coupon.value / 100);
      IF v_coupon.max_discount IS NOT NULL THEN
        v_discount := LEAST(v_discount, v_coupon.max_discount);
      END IF;
    WHEN 'fixed' THEN
      v_discount := LEAST(v_coupon.value, p_subtotal);
    WHEN 'free_shipping' THEN
      v_discount := 0; -- Shipping discount handled separately
  END CASE;
  
  RETURN QUERY SELECT TRUE, v_coupon.id, v_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Function to get product average rating
CREATE OR REPLACE FUNCTION get_product_rating(product_uuid UUID)
RETURNS TABLE (average_rating DECIMAL, review_count INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(rating)::DECIMAL, 1), 0) as average_rating,
    COUNT(*)::INTEGER as review_count
  FROM reviews
  WHERE product_id = product_uuid AND is_approved = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flash_sales_updated_at
  BEFORE UPDATE ON flash_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id 
      AND id != NEW.id 
      AND is_default = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON addresses
  FOR EACH ROW
  WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION ensure_single_default_address();

-- Trigger to ensure only one primary image per product
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = TRUE THEN
    UPDATE product_images
    SET is_primary = FALSE
    WHERE product_id = NEW.product_id 
      AND id != NEW.id 
      AND is_primary = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_primary_image_trigger
  BEFORE INSERT OR UPDATE ON product_images
  FOR EACH ROW
  WHEN (NEW.is_primary = TRUE)
  EXECUTE FUNCTION ensure_single_primary_image();

-- Trigger to update coupon used_count
CREATE OR REPLACE FUNCTION update_coupon_used_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE id = NEW.coupon_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupon_used_count_trigger
  AFTER INSERT ON coupon_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_coupon_used_count();

-- ============================================
-- VIEWS
-- ============================================

-- View for products with primary image and category
CREATE OR REPLACE VIEW products_with_details AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  pi.url as primary_image_url,
  COALESCE(
    (SELECT SUM(stock_quantity) FROM product_variants WHERE product_id = p.id AND is_available = TRUE),
    0
  ) as total_stock,
  COALESCE(
    (SELECT ROUND(AVG(rating)::DECIMAL, 1) FROM reviews WHERE product_id = p.id AND is_approved = TRUE),
    0
  ) as average_rating,
  COALESCE(
    (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND is_approved = TRUE),
    0
  ) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE;

-- View for order summary
CREATE OR REPLACE VIEW order_summary AS
SELECT 
  o.*,
  p.email as customer_email,
  p.full_name as customer_name,
  (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count,
  (SELECT SUM(quantity) FROM order_items WHERE order_id = o.id) as total_items
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id;

-- ============================================
-- GRANTS (for Supabase)
-- ============================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_product_stock_status(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_product_rating(UUID) TO anon;
