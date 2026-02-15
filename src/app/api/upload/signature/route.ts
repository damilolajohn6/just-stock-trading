import { NextResponse } from 'next/server';
import { getCloudinarySignature } from '@/lib/cloudinary/server';
import { createClient } from '@/lib/supabase/server';
import { isUserAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !(await isUserAdmin(user.id))) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const signatureData = await getCloudinarySignature();
  return NextResponse.json(signatureData);
}
