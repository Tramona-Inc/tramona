import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

export function CounterInput({
  value,
  onChange,
  min = 0,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <MinusCircleIcon className="size-3/5 text-muted-foreground" />
      </Button>
      <p className="min-w-[2em] text-center font-bold">{value}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(value + 1)}
      >
        <PlusCircleIcon className="size-3/5 text-muted-foreground" />
      </Button>
    </div>
  );
}
