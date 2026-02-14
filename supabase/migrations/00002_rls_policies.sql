-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_sale_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (role = 'user' OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  );

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = TRUE);

-- Admins can view all categories
CREATE POLICY "Admins can view all categories"
  ON categories FOR SELECT
  USING (is_admin());

-- Admins can manage categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ============================================
-- PRODUCTS POLICIES
-- ============================================

-- Anyone can view published products
CREATE POLICY "Anyone can view published products"
  ON products FOR SELECT
  USING (is_published = TRUE);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (is_admin());

-- Admins can manage products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (is_admin());

-- ============================================
-- PRODUCT IMAGES POLICIES
-- ============================================

-- Anyone can view images of published products
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_images.product_id 
      AND is_published = TRUE
    )
  );

-- Admins can view all images
CREATE POLICY "Admins can view all product images"
  ON product_images FOR SELECT
  USING (is_admin());

-- Admins can manage images
CREATE POLICY "Admins can insert product images"
  ON product_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update product images"
  ON product_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete product images"
  ON product_images FOR DELETE
  USING (is_admin());

-- ============================================
-- PRODUCT VARIANTS POLICIES
-- ============================================

-- Anyone can view variants of published products
CREATE POLICY "Anyone can view product variants"
  ON product_variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE id = product_variants.product_id 
      AND is_published = TRUE
    )
  );

-- Admins can view all variants
CREATE POLICY "Admins can view all variants"
  ON product_variants FOR SELECT
  USING (is_admin());

-- Admins can manage variants
CREATE POLICY "Admins can insert variants"
  ON product_variants FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update variants"
  ON product_variants FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete variants"
  ON product_variants FOR DELETE
  USING (is_admin());

-- ============================================
-- ADDRESSES POLICIES
-- ============================================

-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own addresses
CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all addresses
CREATE POLICY "Admins can view all addresses"
  ON addresses FOR SELECT
  USING (is_admin());

-- ============================================
-- CART ITEMS POLICIES
-- ============================================

-- Users can view their own cart
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own cart
CREATE POLICY "Users can insert cart items"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- WISHLISTS POLICIES
-- ============================================

-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own wishlist
CREATE POLICY "Users can add to wishlist"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from wishlist"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COUPONS POLICIES
-- ============================================

-- Anyone can view active coupons (code only revealed at checkout)
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = TRUE);

-- Admins can manage coupons
CREATE POLICY "Admins can view all coupons"
  ON coupons FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert coupons"
  ON coupons FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete coupons"
  ON coupons FOR DELETE
  USING (is_admin());

-- ============================================
-- COUPON USAGE POLICIES
-- ============================================

-- Users can view their own coupon usage
CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert coupon usage (via service role)
CREATE POLICY "Authenticated can insert coupon usage"
  ON coupon_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all coupon usage
CREATE POLICY "Admins can view all coupon usage"
  ON coupon_usage FOR SELECT
  USING (is_admin());

-- ============================================
-- ORDERS POLICIES
-- ============================================

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin());

-- ============================================
-- ORDER ITEMS POLICIES
-- ============================================

-- Users can view their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_items.order_id 
      AND user_id = auth.uid()
    )
  );

-- Users can insert order items for their orders
CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_items.order_id 
      AND user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (is_admin());

-- ============================================
-- REVIEWS POLICIES
-- ============================================

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = TRUE);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can create reviews
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can view all reviews"
  ON reviews FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update reviews"
  ON reviews FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete reviews"
  ON reviews FOR DELETE
  USING (is_admin());

-- ============================================
-- FLASH SALES POLICIES
-- ============================================

-- Anyone can view active flash sales
CREATE POLICY "Anyone can view active flash sales"
  ON flash_sales FOR SELECT
  USING (is_active = TRUE AND starts_at <= NOW() AND ends_at >= NOW());

-- Admins can manage flash sales
CREATE POLICY "Admins can view all flash sales"
  ON flash_sales FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert flash sales"
  ON flash_sales FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update flash sales"
  ON flash_sales FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete flash sales"
  ON flash_sales FOR DELETE
  USING (is_admin());

-- ============================================
-- FLASH SALE PRODUCTS POLICIES
-- ============================================

-- Anyone can view flash sale products
CREATE POLICY "Anyone can view flash sale products"
  ON flash_sale_products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM flash_sales 
      WHERE id = flash_sale_products.flash_sale_id 
      AND is_active = TRUE 
      AND starts_at <= NOW() 
      AND ends_at >= NOW()
    )
  );

-- Admins can manage flash sale products
CREATE POLICY "Admins can view all flash sale products"
  ON flash_sale_products FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert flash sale products"
  ON flash_sale_products FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update flash sale products"
  ON flash_sale_products FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete flash sale products"
  ON flash_sale_products FOR DELETE
  USING (is_admin());

-- ============================================
-- NEWSLETTER SUBSCRIBERS POLICIES
-- ============================================

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
  ON newsletter_subscribers FOR SELECT
  USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Users can update their own subscription
CREATE POLICY "Users can update own subscription"
  ON newsletter_subscribers FOR UPDATE
  USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
  ON newsletter_subscribers FOR SELECT
  USING (is_admin());

-- Admins can manage subscribers
CREATE POLICY "Admins can update subscribers"
  ON newsletter_subscribers FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete subscribers"
  ON newsletter_subscribers FOR DELETE
  USING (is_admin());

-- ============================================
-- RECENTLY VIEWED POLICIES
-- ============================================

-- Users can view their own recently viewed
CREATE POLICY "Users can view own recently viewed"
  ON recently_viewed FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own recently viewed
CREATE POLICY "Users can insert recently viewed"
  ON recently_viewed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recently viewed"
  ON recently_viewed FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INVENTORY LOGS POLICIES
-- ============================================

-- Only admins can view inventory logs
CREATE POLICY "Admins can view inventory logs"
  ON inventory_logs FOR SELECT
  USING (is_admin());

-- ============================================
-- ADMIN ACTIVITY LOGS POLICIES
-- ============================================

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  USING (is_admin());

-- Admins can insert activity logs
CREATE POLICY "Admins can insert activity logs"
  ON admin_activity_logs FOR INSERT
  WITH CHECK (is_admin());

-- ============================================
-- PAGE VIEWS POLICIES
-- ============================================

-- Anyone can insert page views (for analytics)
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  WITH CHECK (TRUE);

-- Admins can view page views
CREATE POLICY "Admins can view page views"
  ON page_views FOR SELECT
  USING (is_admin());

