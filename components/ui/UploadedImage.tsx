'use client';

import { useEffect, useState } from 'react';
import { getUploadedImage } from '@/lib/contentUpload';
import Image from 'next/image';

interface UploadedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function UploadedImage({ src, alt, className, width, height }: UploadedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    // If it's an uploaded image path, get it from localStorage
    if (src.startsWith('/uploads/')) {
      const uploadedData = getUploadedImage(src);
      if (uploadedData) {
        setImageSrc(uploadedData);
      }
    }
  }, [src]);

  if (width && height) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
}
