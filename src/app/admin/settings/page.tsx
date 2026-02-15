import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "@/components/features/admin/settings-form";

export default async function AdminSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings } = await (supabase as any)
    .from("store_settings")
    .select("*")
    .single();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Store Settings"
        description="Configure global store preferences"
      />
      {settings && <SettingsForm initialData={settings as any} />}
    </div>
  );
}
