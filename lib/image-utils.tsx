import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Thin wrappers around next/image that encode the site's responsive-image
 * rules in one place. next/image already does the heavy lifting the
 * performance budget needs:
 *   - AVIF + WebP output via the on-demand optimizer (next.config.ts)
 *   - responsive srcset derived from `sizes`
 *   - lazy loading for non-priority images
 *   - fetchpriority="high" + preload for priority images
 *   - explicit aspect containers (via fill) so there is no CLS
 *
 * Every helper below only tunes `sizes`, `quality` and priority/loading
 * defaults per usage class — never the layout.
 */

type BaseProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
  style?: CSSProperties;
};

/** Above-the-fold hero artwork. Only ever pass priority for the slide that is
 * actually the LCP element — extra preloads above the first paint just burn
 * bandwidth and push the real LCP request later. */
export function HeroImage({
  src,
  alt,
  sizes,
  className,
  style,
  priority = true,
}: BaseProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes ?? "(max-width: 768px) 100vw, 60vw"}
      quality={85}
      className={cn("object-cover", className)}
      style={style}
    />
  );
}

/** Gallery tiles — the first few are eager, the rest lazy. */
export function GalleryImage({
  src,
  alt,
  index = 0,
  sizes,
  className,
  priority,
}: BaseProps & { index?: number; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority ?? index < 4}
      sizes={sizes ?? "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
      quality={80}
      className={cn("object-cover image-zoom", className)}
    />
  );
}

/** Product / service cards — always lazy, eager never helps below the fold. */
export function ProductImage({ src, alt, sizes, className }: BaseProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      quality={80}
      className={cn("object-cover", className)}
    />
  );
}

/** Small avatars / thumbnails — tiny source, low quality is invisible. */
export function ThumbnailImage({ src, alt, sizes, className }: BaseProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "80px"}
      quality={70}
      className={cn("object-cover", className)}
    />
  );
}

/** Simple shimmer backdrop for Suspense fallbacks (no animation lib needed). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("shimmer rounded-2xl bg-surface", className)}
    />
  );
}
