import { cn } from "@/utils/utils";

/**
 * Use for text, and set the size using `text-sm`, `text-lg`, etc (same size as the text its representing)
 *
 * It's `1lh` (one line height) tall, so it will line up
 */
export function TextSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="pb-[0.1lh] pt-[0.05lh]">
      <div
        className={cn(
          "h-[0.85lh] animate-pulse rounded-md bg-accent",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/**
 * Use `SkeletonText` for text and use this for use for images and whatever else
 *
 * Set `rounded-` and `w-` `h-` to whatever you need in `className`
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse bg-accent", className)} {...props} />
  );
}
