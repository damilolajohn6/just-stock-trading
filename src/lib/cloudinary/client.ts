import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { blur } from "@cloudinary/url-gen/actions/effect";

export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
});

interface ImageOptions {
  width?: number;
  height?: number;
  aspectRatio?: string;
  crop?: string;
}

// Generate optimized URL for an image
export function getOptimizedImageUrl(
  publicId: string,
  options: ImageOptions = {},
) {
  const myImage = cld.image(publicId);

  // Auto-format (WebP/AVIF)
  myImage.delivery(format("auto"));

  // Auto-quality (good balance of size/quality)
  myImage.delivery(quality("auto"));

  // Resizing with smart crop
  if (options.width || options.height) {
    myImage.resize(
      auto()
        .width(options.width as any)
        .height(options.height as any)
        .gravity(autoGravity())
        .aspectRatio(options.aspectRatio as any),
    );
  }

  return myImage.toURL();
}

// Get blur placeholder URL (tiny image)
export function getBlurPlaceholder(publicId: string) {
  const myImage = cld.image(publicId);

  myImage
    .resize(auto().width(10))
    .delivery(quality("auto:low"))
    .effect(blur(1000)); // Add heavy blur

  return myImage.toURL();
}
