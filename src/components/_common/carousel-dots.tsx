import { cn } from "@/utils/utils";

function Dot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full transition-all duration-500",
        isCurrent ? "size-2.5 bg-white" : "size-1.5 bg-white/50",
      )}
    ></div>
  );
}

export function CarouselDots({
  count,
  current,
}: {
  count: number;
  current: number;
}) {
  return (
    <div className="pointer-events-none absolute bottom-2 flex w-full justify-center">
      <div className="flex h-4 items-center gap-2 rounded-full bg-black/40 p-1">
        {Array(count)
          .fill(null)
          .map((_, idx) => (
            <Dot key={idx} isCurrent={idx === current - 1} />
          ))}
      </div>
    </div>
  );
}
