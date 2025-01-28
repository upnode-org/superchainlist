"use client";
import Image, { ImageProps } from "next/image";
import { useState, memo } from "react";

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src: string | undefined;
  fallback: string; 
}

const FallbackImage = memo(
  function FallbackImage({
    src,
    fallback,
    onError,
    ...props
  }: FallbackImageProps) {
    const [imageSrc, setImageSrc] = useState(src);

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log("Error switching to fallback", fallback)
      if (fallback) {
        setImageSrc(fallback);
      }
      if (onError) {
        onError(event); 
      }
    };

    return (
      <Image
        {...props}
        src={imageSrc || fallback}
        onError={handleError}
      />
    );
  },
  (prevProps, nextProps) => {
    // Compare props to prevent unnecessary re-renders
    return (
      prevProps.src === nextProps.src &&
      prevProps.fallback === nextProps.fallback &&
      prevProps.onError === nextProps.onError &&
      Object.keys(prevProps).every(
        key => prevProps[key as keyof typeof prevProps] === nextProps[key as keyof typeof nextProps]
      )
    );
  }
);

export default FallbackImage;
