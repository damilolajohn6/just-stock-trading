"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Upload, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

interface UploadedImage {
  id: string; // public_id
  url: string;
  isNew?: boolean;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  disabled?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  disabled,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const newImages: UploadedImage[] = [];

        // Get signature
        const response = await fetch("/api/upload/signature");
        const { signature, timestamp, folder } = await response.json();

        // Upload each file
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "api_key",
            process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          );
          formData.append("timestamp", timestamp.toString());
          formData.append("signature", signature);
          formData.append("folder", folder);

          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          if (!uploadRes.ok) throw new Error("Upload failed");

          const data = await uploadRes.json();
          newImages.push({
            id: data.public_id,
            url: data.secure_url,
            isNew: true,
          });
        }

        onChange([...value, ...newImages]);
        toast.success("Images uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload images");
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange],
  );


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/avif": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB limit
    disabled: disabled || isUploading,
    multiple: true,
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        if (rejection.errors[0].code === "file-too-large") {
          toast.error(`File ${rejection.file.name} is too large (Max 5MB)`);
        } else {
          toast.error(`File ${rejection.file.name} invalid type`);
        }
      });
    },
  });

  const removeImage = (id: string) => {
    onChange(value.filter((img) => img.id !== id));
  };

  // Simple reorder: move left/right (Drag and drop reorder requires dnd-kit, keeping it simple for now)
  const moveImage = (index: number, direction: "left" | "right") => {
    const newImages = [...value];
    const targetIndex = direction === "left" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];
      onChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {isUploading
              ? "Uploading..."
              : "Drag & drop images here, or click to select"}
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-background"
            >
              <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-20 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}

              <Image
                src={image.url}
                alt="Product image"
                fill
                className="object-cover"
              />

              {/* Reorder controls */}
              <div className="absolute bottom-0 left-0 right-0 p-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 z-20">
                <button
                  type="button"
                  className="text-white hover:text-primary disabled:opacity-30"
                  onClick={() => moveImage(index, "left")}
                  disabled={index === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="text-white hover:text-primary disabled:opacity-30"
                  onClick={() => moveImage(index, "right")}
                  disabled={index === value.length - 1}
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
