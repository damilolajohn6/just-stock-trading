'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, SubmitButton } from '@/components/forms';
import { addressSchema, type AddressFormData } from '@/validators/checkout';

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  showSaveOption?: boolean;
}

const UK_COUNTRIES = [
  { value: 'GB', label: 'United Kingdom' },
  { value: 'IE', label: 'Ireland' },
];

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save Address',
  isLoading = false,
  showSaveOption = false,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'GB',
      ...defaultValues,
    },
  });

  const country = watch('country');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          htmlFor="firstName"
          error={errors.firstName?.message}
          required
        >
          <Input
            id="firstName"
            {...register('firstName')}
            error={!!errors.firstName}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="Last Name"
          htmlFor="lastName"
          error={errors.lastName?.message}
          required
        >
          <Input
            id="lastName"
            {...register('lastName')}
            error={!!errors.lastName}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <FormField
        label="Company"
        htmlFor="company"
        error={errors.company?.message}
      >
        <Input
          id="company"
          {...register('company')}
          placeholder="Optional"
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Address"
        htmlFor="addressLine1"
        error={errors.addressLine1?.message}
        required
      >
        <Input
          id="addressLine1"
          {...register('addressLine1')}
          placeholder="Street address"
          error={!!errors.addressLine1}
          disabled={isLoading}
        />
      </FormField>

      <FormField
        label="Apartment, suite, etc."
        htmlFor="addressLine2"
        error={errors.addressLine2?.message}
      >
        <Input
          id="addressLine2"
          {...register('addressLine2')}
          placeholder="Optional"
          disabled={isLoading}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="City"
          htmlFor="city"
          error={errors.city?.message}
          required
        >
          <Input
            id="city"
            {...register('city')}
            error={!!errors.city}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="County"
          htmlFor="state"
          error={errors.state?.message}
          required
        >
          <Input
            id="state"
            {...register('state')}
            error={!!errors.state}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Postcode"
          htmlFor="postalCode"
          error={errors.postalCode?.message}
          required
        >
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="SW1A 1AA"
            error={!!errors.postalCode}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="Country"
          htmlFor="country"
          error={errors.country?.message}
          required
        >
          <Select
            value={country}
            onValueChange={(value) => setValue('country', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UK_COUNTRIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField
        label="Phone"
        htmlFor="phone"
        error={errors.phone?.message}
      >
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="Optional - for delivery updates"
          disabled={isLoading}
        />
      </FormField>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <SubmitButton
          isLoading={isLoading}
          loadingText="Saving..."
          className="flex-1"
        >
          {submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
