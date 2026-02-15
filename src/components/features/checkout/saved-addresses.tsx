'use client';

import { useState } from 'react';
import { Plus, Check, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
import { AddressForm } from './address-form';
import { createAddress, deleteAddress } from '@/actions/addresses';
import type { AddressFormData } from '@/validators/checkout';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface SavedAddress {
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

interface SavedAddressesProps {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (address: SavedAddress) => void;
  onAddNew: () => void;
}

export function SavedAddresses({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
}: SavedAddressesProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddAddress = async (data: AddressFormData) => {
    setIsLoading(true);
    const result = await createAddress({
      ...data,
      isDefault: false,
      isBilling: false,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success('Address added');
      setShowAddDialog(false);
      // Refresh addresses - in real app, would refetch
    } else {
      toast.error(result.error || 'Failed to add address');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsLoading(true);
    const result = await deleteAddress(deleteId);
    setIsLoading(false);

    if (result.success) {
      toast.success('Address deleted');
      setDeleteId(null);
    } else {
      toast.error(result.error || 'Failed to delete address');
    }
  };

  const formatAddress = (addr: SavedAddress) => {
    const parts = [
      addr.address_line1,
      addr.address_line2,
      addr.city,
      addr.state,
      addr.postal_code,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Saved Addresses</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      {addresses.length > 0 ? (
        <RadioGroup
          value={selectedId || ''}
          onValueChange={(id) => {
            const address = addresses.find((a) => a.id === id);
            if (address) onSelect(address);
          }}
        >
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={cn(
                  'relative flex items-start gap-3 rounded-lg border p-4 transition-colors',
                  selectedId === address.id && 'border-primary bg-primary/5'
                )}
              >
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="mt-1"
                />
                <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {address.first_name} {address.last_name}
                        {address.is_default && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </p>
                      {address.company && (
                        <p className="text-sm text-muted-foreground">
                          {address.company}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatAddress(address)}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-muted-foreground">
                          {address.phone}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteId(address.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No saved addresses</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      )}

      {/* Use New Address button */}
      <Button
        variant="ghost"
        className="w-full"
        onClick={onAddNew}
      >
        Use a different address
      </Button>

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddAddress}
            onCancel={() => setShowAddDialog(false)}
            isLoading={isLoading}
          />
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
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
