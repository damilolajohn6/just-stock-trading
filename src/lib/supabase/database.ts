import { createClient } from "./server";
import { createAdminClient } from "./admin";
import type {
  ProductWithDetails,
  ProductFilters,
  ProductCard,
} from "@/types/product";
import type { OrderWithDetails } from "@/types/order";

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(filters: ProductFilters = {}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, public_id, alt_text, is_primary),
      variants:product_variants(id, size, color, stock_quantity, is_available, price_adjustment)
    `,
    )
    .eq("is_published", true);

  // Apply filters
  if (filters.category) {
    query = query.eq("categories.slug", filters.category);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.brands && filters.brands.length > 0) {
    query = query.in("brand", filters.brands);
  }

  if (filters.conditions && filters.conditions.length > 0) {
    query = query.in("condition", filters.conditions);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`,
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return {
    products: data as ProductWithDetails[],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug, parent_id),
      images:product_images(id, url, public_id, alt_text, sort_order, is_primary),
      variants:product_variants(id, size, color, sku, stock_quantity, is_available, price_adjustment)
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching product:", error);
    throw error;
  }

  // Increment view count
  await supabase.rpc("increment_product_view", { product_uuid: data.id });

  return data as ProductWithDetails;
}

export async function getFeaturedProducts(limit: number = 8) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      images:product_images(url, alt_text)
    `,
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }

  return data;
}

export async function getTrendingProducts(limit: number = 8) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      images:product_images(url, alt_text)
    `,
    )
    .eq("is_published", true)
    .eq("is_trending", true)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }

  return data;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, price, compare_at_price, condition, brand,
      images:product_images(url, alt_text)
    `,
    )
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .limit(limit);

  if (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }

  return data;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data;
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      *,
      children:categories!parent_id(id, name, slug, image_url)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching category:", error);
    throw error;
  }

  return data;
}

export async function getCategoryTree() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching category tree:", error);
    throw error;
  }

  // Fetch children for each parent
  const categoriesWithChildren = await Promise.all(
    data.map(async (category) => {
      const { data: children } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", category.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      return {
        ...category,
        children: children || [],
      };
    }),
  );

  return categoriesWithChildren;
}

// ============================================
// CART
// ============================================

export async function getCartItems(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products(
        id, name, slug, price, compare_at_price,
        images:product_images(url, alt_text)
      ),
      variant:product_variants(id, size, color, stock_quantity, price_adjustment)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }

  return data;
}

export async function addToCart(
  userId: string,
  productId: string,
  variantId: string | null,
  quantity: number = 1,
) {
  const supabase = await createClient();

  // Check if item already exists in cart
  let query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (variantId) {
    query = query.eq('variant_id', variantId);
  } else {
    query = query.is('variant_id', null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Insert new item
  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: userId,
      product_id: productId,
      variant_id: variantId,
      quantity,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) throw error;
}

export async function clearCart(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}

// ============================================
// WISHLIST
// ============================================

export async function getWishlistItems(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wishlists")
    .select(
      `
      id,
      product:products(
        id, name, slug, price, compare_at_price, condition,
        images:product_images(url, alt_text)
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function addToWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      // Already in wishlist
      return null;
    }
    throw error;
  }
  return data;
}

export async function removeFromWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function isInWishlist(userId: string, productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}

// ============================================
// ORDERS
// ============================================

export async function getOrders(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        id, quantity, unit_price, total_price, product_snapshot
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as OrderWithDetails[];
}

export async function getOrderByNumber(orderNumber: string, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        id, quantity, unit_price, total_price, product_snapshot,
        product:products(id, name, slug)
      )
    `,
    )
    .eq("order_number", orderNumber)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as OrderWithDetails;
}

// ============================================
// ADDRESSES
// ============================================

export async function getAddresses(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getDefaultAddress(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// ============================================
// REVIEWS
// ============================================

export async function getProductReviews(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles(id, full_name, avatar_url)
    `,
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// ============================================
// NEWSLETTER
// ============================================

export async function subscribeToNewsletter(email: string, firstName?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email, first_name: firstName, is_subscribed: true },
      { onConflict: "email" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// RECENTLY VIEWED
// ============================================

export async function addRecentlyViewed(userId: string, productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("recently_viewed")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,product_id" },
    );

  if (error) throw error;
}

export async function getRecentlyViewed(userId: string, limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recently_viewed")
    .select(
      `
      product:products(
        id, name, slug, price, compare_at_price,
        images:product_images(url, alt_text)
      )
    `,
    )
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// ============================================
// COUPONS
// ============================================

export async function validateCoupon(
  code: string,
  userId: string,
  subtotal: number,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("validate_coupon", {
    p_code: code,
    p_user_id: userId,
    p_subtotal: subtotal,
  });

  if (error) throw error;
  return data[0];
}
