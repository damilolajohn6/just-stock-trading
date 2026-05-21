"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/categories";

interface CategoryActionsProps {
  categoryId: string;
}

export function CategoryActions({ categoryId }: CategoryActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? Subcategories and products must be deleted first.")) return;
    setIsDeleting(true);
    try {
      const res = await deleteCategory(categoryId);
      if (res.success) {
        toast.success("Category deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete category");
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
      title="Delete category"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
