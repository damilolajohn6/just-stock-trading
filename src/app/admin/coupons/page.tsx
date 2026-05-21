import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getCoupons } from "@/actions/coupons";
import { CouponActions } from "@/components/features/admin/coupon-actions";
import { formatDate } from "@/utils/format";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    if (type === "fixed") {
      return `£${value.toFixed(2)}`;
    }
    if (type === "free_shipping") {
      return "Free Shipping";
    }
    return value.toString();
  };

  const getCouponStatus = (coupon: any) => {
    if (!coupon.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    const now = new Date();
    if (coupon.starts_at && new Date(coupon.starts_at) > now) {
      return <Badge variant="outline">Scheduled</Badge>;
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return (
      <Badge variant="outline" className="border-green-600 text-green-600">
        Active
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Coupons"
          description="Manage promotional codes and discounts"
        />
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min. Purchase</TableHead>
              <TableHead>Usage Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No coupons found. Create one to get started!
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="capitalize">
                    {coupon.type.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    {formatValue(coupon.type, coupon.value)}
                  </TableCell>
                  <TableCell>
                    {coupon.min_purchase
                      ? `£${coupon.min_purchase.toFixed(2)}`
                      : "None"}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count} /{" "}
                    {coupon.max_uses ? coupon.max_uses : "∞"}
                  </TableCell>
                  <TableCell>{getCouponStatus(coupon)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {coupon.expires_at ? formatDate(coupon.expires_at) : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <CouponActions couponId={coupon.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
