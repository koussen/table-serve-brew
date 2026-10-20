import { useState, type ImgHTMLAttributes } from "react";
import { findCafeImage } from "@/lib/cafe-images";

type CafeImageProps = ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function CafeImage({ src, className = "", loading = "lazy", onLoad, ...props }: CafeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const image = findCafeImage(src);
  return (
    <img
      width={image?.width}
      height={image?.height}
      srcSet={image?.srcSet}
      {...props}
      src={src}
      loading={loading}
      decoding="async"
      className={`cafe-photo ${loading === "lazy" && loaded ? "cafe-photo-arrived" : ""} ${className}`}
      onLoad={(event) => { setLoaded(true); onLoad?.(event); }}
    />
  );
}