import { getNavCategories } from '@/lib/supabase/queries';
import { HeaderClient } from './header';

export async function Header() {
  const navItems = await getNavCategories();

  return <HeaderClient navItems={navItems} />;
}
