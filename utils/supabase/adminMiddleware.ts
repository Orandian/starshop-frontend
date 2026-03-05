import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from './supabase-server';

export async function requireAdminMiddleware(req: NextRequest) {
  const supabase = createSupabaseServerClient(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('users')
    .select('user_type, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data || data.user_type !== 'admin' || !data.is_active) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  return null;
}
