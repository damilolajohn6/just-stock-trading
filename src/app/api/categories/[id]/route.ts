import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isUserAdmin } from '@/lib/supabase/admin';
import { categorySchema } from '@/validators/category';

// GET: Single category
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*, children:categories(*)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PUT: Update category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isUserAdmin(user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validation = categorySchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('categories')
    .update(validation.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE: Delete category
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isUserAdmin(user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from('categories').delete().eq('id', id);

  if (error) {
    // Likely foreign key constraint
    return NextResponse.json({ error: 'Cannot delete category in use' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
