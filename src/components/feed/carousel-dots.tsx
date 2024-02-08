import { cn } from "@/utils/utils";

function Dot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "h-1.5 w-1.5 rounded-full",
        isCurrent ? "h-2.5 w-2.5 bg-white" : "bg-zinc-400",
      )}
    ></div>
  );
}

export default function CarouselDots({
  count,
  current,
}: {
  count: number;
  current: number;
}) {
  return (
    <div className="absolute bottom-2 flex w-full justify-center">
      <div className=" flex items-center gap-2 rounded-full bg-zinc-950/50 px-3 py-1">
        {Array(count)
          .fill(null)
          .map((_, idx) => (
            <Dot key={idx} isCurrent={idx === current - 1} />
          ))}
      </div>
    </div>
  );
}
