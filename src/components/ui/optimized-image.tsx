'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { getOptimizedImageUrl } from '@/lib/cloudinary/client';
import { cn } from '@/utils/cn';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  publicId: string; // Cloudinary Public ID or full URL
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export function OptimizedImage({
  publicId,
  width,
  height,
  aspectRatio,
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // If it's already a URL (e.g. from seed data), use it directly
  // Otherwise, generate Cloudinary URL
  const isUrl = publicId.startsWith('http');
  
  const src = isUrl 
    ? publicId 
    : getOptimizedImageUrl(publicId, { width, height, aspectRatio });

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 800}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}
