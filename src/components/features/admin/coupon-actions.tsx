"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCoupon } from "@/actions/coupons";

interface CouponActionsProps {
  couponId: string;
}

export function CouponActions({ couponId }: CouponActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    setIsDeleting(true);
    try {
      const res = await deleteCoupon(couponId);
      if (res.success) {
        toast.success("Coupon deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete coupon");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
