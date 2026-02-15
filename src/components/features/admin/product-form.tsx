"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField, SubmitButton } from "@/components/forms";
import { ImageUploader } from "./image-uploader";

import { productSchema, type ProductFormData } from "@/validators/product";
import { createProduct, updateProduct } from "@/actions/products";
import { CONDITION_OPTIONS, SIZE_OPTIONS } from "@/constants/filters";

interface ProductFormProps {
  initialData?: any; // Replace with proper type
  categories: { id: string; name: string }[];
  isEdit?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: (initialData || {
      condition: "good",
      is_published: false,
      is_featured: false,
      variants: [{ size: "M", stock_quantity: 1 }],
      images: [],
    }) as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const images = watch("images");

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const result = isEdit
        ? await updateProduct(initialData.id, data)
        : await createProduct(data);

      if (result.success) {
        toast.success(isEdit ? "Product updated" : "Product created");
        router.push("/admin/products");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Product Name"
                htmlFor="name"
                error={errors.name?.message}
                required
              >
                <Input id="name" {...register("name")} />
              </FormField>

              <FormField
                label="Slug"
                htmlFor="slug"
                error={errors.slug?.message}
                required
              >
                <Input id="slug" {...register("slug")} />
              </FormField>

              <FormField label="Description" htmlFor="description">
                <Textarea
                  id="description"
                  {...register("description")}
                  className="min-h-[150px]"
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={images}
                onChange={(imgs) =>
                  setValue("images", imgs, { shouldValidate: true })
                }
              />
              {errors.images && (
                <p className="text-sm text-destructive mt-2">
                  {errors.images.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-4 items-end border-b pb-4"
                >
                  <div className="w-24">
                    <Label className="text-xs">Size</Label>
                    <Select
                      defaultValue={field.size}
                      onValueChange={(val) =>
                        setValue(`variants.${index}.size`, val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZE_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock_quantity` as const)}
                    />
                  </div>

                  <div className="flex-1">
                    <Label className="text-xs">SKU (Optional)</Label>
                    <Input {...register(`variants.${index}.sku` as const)} />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ size: "", stock_quantity: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
              {errors.variants && (
                <p className="text-sm text-destructive">
                  {errors.variants.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Published</Label>
                <Switch
                  id="is_published"
                  checked={watch("is_published")}
                  onCheckedChange={(c) => setValue("is_published", c)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={watch("is_featured")}
                  onCheckedChange={(c) => setValue("is_featured", c)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Category"
                htmlFor="category_id"
                error={errors.category_id?.message}
              >
                <Select
                  onValueChange={(val) => setValue("category_id", val)}
                  defaultValue={initialData?.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Brand"
                htmlFor="brand"
                error={errors.brand?.message}
              >
                <Input {...register("brand")} />
              </FormField>

              <FormField label="Condition" htmlFor="condition">
                <Select
                  onValueChange={(val: any) => setValue("condition", val)}
                  defaultValue={initialData?.condition || "good"}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Price (£)"
                htmlFor="price"
                error={errors.price?.message}
                required
              >
                <Input type="number" step="0.01" {...register("price")} />
              </FormField>
              <FormField
                label="Compare At Price (£)"
                htmlFor="compare_at_price"
              >
                <Input
                  type="number"
                  step="0.01"
                  {...register("compare_at_price")}
                />
              </FormField>
              <FormField label="Cost Price (£)" htmlFor="cost_price">
                <Input type="number" step="0.01" {...register("cost_price")} />
              </FormField>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <SubmitButton isLoading={isLoading}>
          {isEdit ? "Update Product" : "Create Product"}
        </SubmitButton>
      </div>
    </form>
  );
}
