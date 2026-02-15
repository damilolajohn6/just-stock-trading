import { PageHeader } from '@/components/shared/page-header';
import { CouponForm } from '@/components/features/admin/coupon-form';

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Coupon" description="Add a new discount code" />
      <CouponForm />
    </div>
  );
}
