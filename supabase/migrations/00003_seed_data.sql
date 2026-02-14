-- ============================================
-- SEED DATA FOR DEVELOPMENT
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES
  -- Main categories
  ('11111111-1111-1111-1111-111111111111', 'Women', 'women', 'Pre-loved fashion for women', '/images/categories/women.jpg', 1, TRUE),
  ('22222222-2222-2222-2222-222222222222', 'Men', 'men', 'Quality second-hand menswear', '/images/categories/men.jpg', 2, TRUE),
  ('33333333-3333-3333-3333-333333333333', 'Vintage', 'vintage', 'Curated vintage pieces from all eras', '/images/categories/vintage.jpg', 3, TRUE),
  ('44444444-4444-4444-4444-444444444444', 'Accessories', 'accessories', 'Bags, jewelry, hats and more', '/images/categories/accessories.jpg', 4, TRUE),
  ('55555555-5555-5555-5555-555555555555', 'Footwear', 'footwear', 'Pre-loved shoes and boots', '/images/categories/footwear.jpg', 5, TRUE),
  ('66666666-6666-6666-6666-666666666666', 'Kids', 'kids', 'Quality second-hand children clothing', '/images/categories/kids.jpg', 6, TRUE);

-- Subcategories for Women
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
  ('Dresses', 'women-dresses', 'All styles of dresses', '11111111-1111-1111-1111-111111111111', 1, TRUE),
  ('Tops', 'women-tops', 'Blouses, t-shirts, and more', '11111111-1111-1111-1111-111111111111', 2, TRUE),
  ('Bottoms', 'women-bottoms', 'Jeans, skirts, trousers', '11111111-1111-1111-1111-111111111111', 3, TRUE),
  ('Outerwear', 'women-outerwear', 'Jackets, coats, blazers', '11111111-1111-1111-1111-111111111111', 4, TRUE),
  ('Knitwear', 'women-knitwear', 'Sweaters and cardigans', '11111111-1111-1111-1111-111111111111', 5, TRUE),
  ('Activewear', 'women-activewear', 'Sports and fitness wear', '11111111-1111-1111-1111-111111111111', 6, TRUE);

-- Subcategories for Men
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
  ('Shirts', 'men-shirts', 'Casual and formal shirts', '22222222-2222-2222-2222-222222222222', 1, TRUE),
  ('T-Shirts', 'men-tshirts', 'Graphic and plain tees', '22222222-2222-2222-2222-222222222222', 2, TRUE),
  ('Trousers', 'men-trousers', 'Jeans, chinos, and more', '22222222-2222-2222-2222-222222222222', 3, TRUE),
  ('Outerwear', 'men-outerwear', 'Jackets and coats', '22222222-2222-2222-2222-222222222222', 4, TRUE),
  ('Knitwear', 'men-knitwear', 'Sweaters and jumpers', '22222222-2222-2222-2222-222222222222', 5, TRUE),
  ('Sportswear', 'men-sportswear', 'Athletic and sports wear', '22222222-2222-2222-2222-222222222222', 6, TRUE);

-- Subcategories for Vintage
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
  ('70s & 80s', 'vintage-70s-80s', 'Retro pieces from the 70s and 80s', '33333333-3333-3333-3333-333333333333', 1, TRUE),
  ('90s', 'vintage-90s', 'Classic 90s fashion', '33333333-3333-3333-3333-333333333333', 2, TRUE),
  ('Y2K', 'vintage-y2k', '2000s nostalgia pieces', '33333333-3333-3333-3333-333333333333', 3, TRUE),
  ('Designer Vintage', 'vintage-designer', 'Luxury vintage finds', '33333333-3333-3333-3333-333333333333', 4, TRUE);

-- Subcategories for Accessories
INSERT INTO categories (name, slug, description, parent_id, sort_order, is_active) VALUES
  ('Bags', 'accessories-bags', 'Handbags, backpacks, and more', '44444444-4444-4444-4444-444444444444', 1, TRUE),
  ('Jewelry', 'accessories-jewelry', 'Necklaces, rings, earrings', '44444444-4444-4444-4444-444444444444', 2, TRUE),
  ('Hats', 'accessories-hats', 'Caps, beanies, sun hats', '44444444-4444-4444-4444-444444444444', 3, TRUE),
  ('Belts', 'accessories-belts', 'Leather and fabric belts', '44444444-4444-4444-4444-444444444444', 4, TRUE),
  ('Scarves', 'accessories-scarves', 'Silk and wool scarves', '44444444-4444-4444-4444-444444444444', 5, TRUE);

-- ============================================
-- SAMPLE PRODUCTS
-- ============================================

INSERT INTO products (
  id, name, slug, description, short_description, brand, category_id, 
  price, compare_at_price, condition, material, color,
  is_featured, is_trending, is_published, tags
) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Vintage Levi''s 501 Jeans',
    'vintage-levis-501-jeans',
    'Classic Levi''s 501 jeans in excellent vintage condition. High-waisted fit with original button fly. Perfect broken-in look with minimal wear.',
    'Classic high-waisted vintage Levi''s in excellent condition',
    'Levi''s',
    '33333333-3333-3333-3333-333333333333',
    45.00,
    65.00,
    'like_new',
    'Cotton Denim',
    'Blue',
    TRUE,
    TRUE,
    TRUE,
    ARRAY['vintage', 'denim', 'levis', '90s', 'high-waisted']
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Floral Midi Dress',
    'floral-midi-dress',
    'Beautiful floral print midi dress perfect for spring and summer. Flowy silhouette with adjustable waist tie. Light and breathable fabric.',
    'Flowy floral midi dress for spring',
    'Zara',
    '11111111-1111-1111-1111-111111111111',
    28.00,
    NULL,
    'good',
    'Viscose',
    'Multicolor',
    TRUE,
    FALSE,
    TRUE,
    ARRAY['floral', 'midi', 'summer', 'dress']
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Wool Overcoat',
    'wool-overcoat-charcoal',
    'Sophisticated charcoal wool overcoat. Classic single-breasted design with notched lapels. Warm and elegant for autumn/winter.',
    'Classic charcoal wool overcoat',
    'Uniqlo',
    '22222222-2222-2222-2222-222222222222',
    75.00,
    120.00,
    'like_new',
    'Wool Blend',
    'Gray',
    TRUE,
    TRUE,
    TRUE,
    ARRAY['coat', 'wool', 'winter', 'formal', 'overcoat']
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Leather Crossbody Bag',
    'leather-crossbody-bag-tan',
    'Genuine leather crossbody bag in beautiful tan color. Adjustable strap, multiple compartments. Shows gentle patina adding to its character.',
    'Tan leather crossbody with character',
    'Coach',
    '44444444-4444-4444-4444-444444444444',
    55.00,
    150.00,
    'good',
    'Leather',
    'Brown',
    FALSE,
    TRUE,
    TRUE,
    ARRAY['leather', 'bag', 'crossbody', 'coach', 'designer']
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Nike Air Max 90',
    'nike-air-max-90-white',
    'Classic Nike Air Max 90 in white/grey colorway. Good condition with visible wear on sole. Cleaned and ready to wear.',
    'Classic Air Max 90 in white',
    'Nike',
    '55555555-5555-5555-5555-555555555555',
    40.00,
    90.00,
    'good',
    'Leather/Mesh',
    'White',
    FALSE,
    FALSE,
    TRUE,
    ARRAY['nike', 'sneakers', 'air max', 'retro', 'streetwear']
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Cashmere Sweater',
    'cashmere-sweater-burgundy',
    'Luxurious pure cashmere crew neck sweater in rich burgundy. Incredibly soft with no pilling. A true investment piece.',
    'Pure cashmere crew neck in burgundy',
    'J.Crew',
    '11111111-1111-1111-1111-111111111111',
    65.00,
    180.00,
    'like_new',
    'Cashmere',
    'Red',
    TRUE,
    FALSE,
    TRUE,
    ARRAY['cashmere', 'sweater', 'luxury', 'knitwear', 'winter']
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '90s Champion Hoodie',
    '90s-champion-hoodie-navy',
    'Authentic 90s Champion reverse weave hoodie. The perfect vintage streetwear piece. Faded navy color with classic logo.',
    'Authentic 90s Champion reverse weave',
    'Champion',
    '33333333-3333-3333-3333-333333333333',
    48.00,
    NULL,
    'good',
    'Cotton',
    'Navy',
    FALSE,
    TRUE,
    TRUE,
    ARRAY['vintage', 'champion', '90s', 'streetwear', 'hoodie']
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Silk Blouse',
    'silk-blouse-cream',
    'Elegant cream silk blouse with delicate pearl buttons. Perfect for work or special occasions. Dry clean only.',
    'Elegant cream silk blouse',
    'Equipment',
    '11111111-1111-1111-1111-111111111111',
    42.00,
    200.00,
    'like_new',
    'Silk',
    'Beige',
    FALSE,
    FALSE,
    TRUE,
    ARRAY['silk', 'blouse', 'elegant', 'workwear', 'equipment']
  );

-- ============================================
-- PRODUCT IMAGES
-- ============================================

INSERT INTO product_images (product_id, url, public_id, alt_text, sort_order, is_primary) VALUES
  -- Levi's Jeans
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800', 'levis-jeans-1', 'Vintage Levi''s 501 Jeans front view', 0, TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', 'levis-jeans-2', 'Vintage Levi''s 501 Jeans back view', 1, FALSE),
  
  -- Floral Dress
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', 'floral-dress-1', 'Floral Midi Dress front view', 0, TRUE),
  
  -- Wool Overcoat
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', 'wool-coat-1', 'Wool Overcoat front view', 0, TRUE),
  
  -- Leather Bag
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 'leather-bag-1', 'Leather Crossbody Bag', 0, TRUE),
  
  -- Nike Air Max
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'https://images.unsplash.com/photo-1514989940723-e8e51d675571?w=800', 'nike-airmax-1', 'Nike Air Max 90 side view', 0, TRUE),
  
  -- Cashmere Sweater
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', 'cashmere-sweater-1', 'Cashmere Sweater', 0, TRUE),
  
  -- Champion Hoodie
  ('77777777-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 'champion-hoodie-1', '90s Champion Hoodie', 0, TRUE),
  
  -- Silk Blouse
  ('88888888-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800', 'silk-blouse-1', 'Silk Blouse', 0, TRUE);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================

-- Levi's Jeans variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'S', 'Blue', 2, TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'M', 'Blue', 3, TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'L', 'Blue', 1, TRUE);

-- Floral Dress variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'XS', 'Multicolor', 1, TRUE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'S', 'Multicolor', 2, TRUE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'M', 'Multicolor', 2, TRUE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'L', 'Multicolor', 1, TRUE);

-- Wool Overcoat variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'M', 'Gray', 1, TRUE),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'L', 'Gray', 2, TRUE),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'XL', 'Gray', 1, TRUE);

-- Leather Bag (One Size)
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'One Size', 'Brown', 1, TRUE);

-- Nike Air Max variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'UK 8', 'White', 1, TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'UK 9', 'White', 1, TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'UK 10', 'White', 0, FALSE);

-- Cashmere Sweater variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'S', 'Red', 1, TRUE),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'M', 'Red', 2, TRUE);

-- Champion Hoodie variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('77777777-7777-7777-7777-777777777777', 'M', 'Navy', 1, TRUE),
  ('77777777-7777-7777-7777-777777777777', 'L', 'Navy', 2, TRUE),
  ('77777777-7777-7777-7777-777777777777', 'XL', 'Navy', 1, TRUE);

-- Silk Blouse variants
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available) VALUES
  ('88888888-8888-8888-8888-888888888888', 'XS', 'Beige', 1, TRUE),
  ('88888888-8888-8888-8888-888888888888', 'S', 'Beige', 2, TRUE),
  ('88888888-8888-8888-8888-888888888888', 'M', 'Beige', 1, TRUE);

-- ============================================
-- SAMPLE COUPONS
-- ============================================

INSERT INTO coupons (code, type, value, min_purchase, max_uses, is_active, starts_at, expires_at) VALUES
  ('WELCOME10', 'percentage', 10.00, 20.00, NULL, TRUE, NOW(), NOW() + INTERVAL '1 year'),
  ('THRIFT20', 'percentage', 20.00, 50.00, 100, TRUE, NOW(), NOW() + INTERVAL '3 months'),
  ('FIVER', 'fixed', 5.00, 30.00, 50, TRUE, NOW(), NOW() + INTERVAL '1 month'),
  ('FREESHIP', 'free_shipping', 0.00, 40.00, NULL, TRUE, NOW(), NOW() + INTERVAL '6 months');

-- ============================================
-- SAMPLE FLASH SALE
-- ============================================

INSERT INTO flash_sales (id, name, slug, description, discount_percentage, starts_at, ends_at, is_active) VALUES
  (
    '99999999-9999-9999-9999-999999999999',
    'Weekend Flash Sale',
    'weekend-flash-sale',
    'Up to 30% off selected vintage items!',
    30.00,
    NOW(),
    NOW() + INTERVAL '3 days',
    TRUE
  );

INSERT INTO flash_sale_products (flash_sale_id, product_id) VALUES
  ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('99999999-9999-9999-9999-999999999999', '77777777-7777-7777-7777-777777777777');

-- ============================================
-- END OF SEED DATA
-- ============================================