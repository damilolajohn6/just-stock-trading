'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { savedAddressSchema, type SavedAddressFormData } from '@/validators/checkout';

export interface AddressResponse {
  success: boolean;
  addressId?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Get user's addresses
export async function getAddresses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }

  return data;
}

// Get default address
export async function getDefaultAddress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching default address:', error);
  }

  return data;
}

// Create new address
export async function createAddress(
  formData: SavedAddressFormData
): Promise<AddressResponse> {
  // Validate
  const validated = savedAddressSchema.safeParse(formData);
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid address data',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const addressData = {
    user_id: user.id,
    label: formData.label,
    first_name: formData.firstName,
    last_name: formData.lastName,
    company: formData.company,
    address_line1: formData.addressLine1,
    address_line2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    postal_code: formData.postalCode,
    country: formData.country,
    phone: formData.phone,
    is_default: formData.isDefault,
    is_billing: formData.isBilling,
  };

  const { data, error } = await supabase
    .from('addresses')
    .insert(addressData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating address:', error);
    return { success: false, error: 'Failed to create address' };
  }

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');

  return { success: true, addressId: data.id };
}

// Update address
export async function updateAddress(
  addressId: string,
  formData: SavedAddressFormData
): Promise<AddressResponse> {
  // Validate
  const validated = savedAddressSchema.safeParse(formData);
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid address data',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('addresses')
    .update({
      label: formData.label,
      first_name: formData.firstName,
      last_name: formData.lastName,
      company: formData.company,
      address_line1: formData.addressLine1,
      address_line2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postalCode,
      country: formData.country,
      phone: formData.phone,
      is_default: formData.isDefault,
      is_billing: formData.isBilling,
    })
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating address:', error);
    return { success: false, error: 'Failed to update address' };
  }

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');

  return { success: true, addressId };
}

// Delete address
export async function deleteAddress(addressId: string): Promise<AddressResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting address:', error);
    return { success: false, error: 'Failed to delete address' };
  }

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');

  return { success: true };
}

// Set default address
export async function setDefaultAddress(addressId: string): Promise<AddressResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // The trigger in the database will handle unsetting other defaults
  const { error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', addressId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error setting default address:', error);
    return { success: false, error: 'Failed to set default address' };
  }

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');

  return { success: true };
}
