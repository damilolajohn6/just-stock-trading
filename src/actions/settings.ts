"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isUserAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const settingsSchema = z.object({
  store_name: z.string().min(1),
  support_email: z.string().email(),
  free_shipping_threshold: z.coerce.number().min(0),
  tax_rate: z.coerce.number().min(0).max(100),
  maintenance_mode: z.boolean(),
  announcement_bar_text: z.string().optional(),
  announcement_bar_active: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export async function getStoreSettings() {
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from("store_settings")
    .select("*")
    .single();
  return data;
}

export async function updateStoreSettings(data: SettingsFormData) {
  const result = settingsSchema.safeParse(data);
  if (!result.success) return { success: false, error: "Invalid data" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isUserAdmin(user.id))) {
    return { success: false, error: "Unauthorized" };
  }

  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("store_settings")
    .update({
      ...result.data,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", 1);

  if (error) {
    console.error("Settings update error:", error);
    return { success: false, error: "Failed to update settings" };
  }

  revalidatePath("/", "layout"); // Revalidate everywhere
  return { success: true };
}
