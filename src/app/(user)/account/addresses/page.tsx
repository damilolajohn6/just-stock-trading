'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AddressForm } from '@/components/features/checkout/address-form';
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/actions/addresses';
import type { SavedAddressFormData } from '@/validators/checkout';
import { EmptyState } from '@/components/shared/empty-state';

interface Address {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  company: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    const data = await getAddresses();
    setAddresses(data);
    setIsLoading(false);
  };

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    const result = await createAddress({
      ...data,
      isDefault: addresses.length === 0, // First address is default
      isBilling: false,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Address added');
      setShowAddDialog(false);
      loadAddresses();
    } else {
      toast.error(result.error || 'Failed to add address');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingAddress) return;

    setIsSubmitting(true);
    const result = await updateAddress(editingAddress.id, {
      ...data,
      isDefault: editingAddress.is_default,
      isBilling: false,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Address updated');
      setEditingAddress(null);
      loadAddresses();
    } else {
      toast.error(result.error || 'Failed to update address');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsSubmitting(true);
    const result = await deleteAddress(deleteId);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Address deleted');
      setDeleteId(null);
      loadAddresses();
    } else {
      toast.error(result.error || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result.success) {
      toast.success('Default address updated');
      loadAddresses();
    } else {
      toast.error(result.error || 'Failed to set default');
    }
  };

  const formatAddress = (addr: Address) => (
    <>
      {addr.address_line1}
      {addr.address_line2 && <>, {addr.address_line2}</>}
      <br />
      {addr.city}, {addr.state} {addr.postal_code}
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Addresses" description="Manage your shipping addresses">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </PageHeader>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses yet"
          description="Add your first address to make checkout faster"
          actionLabel="Add Address"
          onAction={() => setShowAddDialog(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {address.first_name} {address.last_name}
                    </p>
                    {address.is_default && (
                      <Badge variant="secondary" className="mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingAddress(address)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {address.company && (
                  <p className="text-sm text-muted-foreground">{address.company}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {formatAddress(address)}
                </p>
                {address.phone && (
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                )}

                {!address.is_default && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Set as default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddDialog(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingAddress}
        onOpenChange={() => setEditingAddress(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm
              defaultValues={{
                firstName: editingAddress.first_name,
                lastName: editingAddress.last_name,
                company: editingAddress.company || '',
                addressLine1: editingAddress.address_line1,
                addressLine2: editingAddress.address_line2 || '',
                city: editingAddress.city,
                state: editingAddress.state,
                postalCode: editingAddress.postal_code,
                country: editingAddress.country,
                phone: editingAddress.phone || '',
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingAddress(null)}
              isLoading={isSubmitting}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
