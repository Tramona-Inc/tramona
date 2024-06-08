import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from '@/utils/utils'
import { useMediaQuery } from '@/components/_utils/useMediaQuery'



export function CounterInput({
  value,
  onChange,
  min = 0,
  max,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className: string
}) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  return (
    <div className="flex items-center justify-between">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusCircleIcon className={cn(className, "text-muted-foreground")} />
      </Button>
      {!isMobile ? 
      <p className="w-[0.5em] text-center font-bold">{value}</p>
      : 
      <p className="w-[1em] text-center font-bold">{value}</p>
    }
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusCircleIcon className={cn(className, "text-muted-foreground")} />
      </Button>
    </div>
  );
}
