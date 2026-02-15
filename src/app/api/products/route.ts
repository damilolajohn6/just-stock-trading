import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supabase = await createClient();

  // Extract filters
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sizes = searchParams.getAll("sizes");
  const brands = searchParams.getAll("brands");
  const conditions = searchParams.getAll("conditions");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("search");

  // Build query
  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories!inner(id, name, slug),
      images:product_images(url, alt_text, is_primary),
      variants:product_variants(size, color, stock_quantity, is_available)
    `,
      { count: "exact" },
    )
    .eq("is_published", true);

  // Apply filters
  if (category) {
    query = query.eq("category.slug", category);
  }

  if (minPrice) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice) {
    query = query.lte("price", maxPrice);
  }

  if (brands.length > 0) {
    query = query.in("brand", brands);
  }

  if (conditions.length > 0) {
    query = query.in("condition", conditions as any);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`,
    );
  }

  // Sorting
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // Pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Products API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Format response
  const products = data.map((product: any) => ({
    ...product,
    images: product.images.sort(
      (a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0),
    ),
    image: product.images[0]?.url || null, // Backwards compatibility
  }));

  return NextResponse.json({
    data: products,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}
