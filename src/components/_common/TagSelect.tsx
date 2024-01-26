import { cn } from "@/utils/utils";

export default function TagSelect<TOption extends string>(props: {
  options: readonly TOption[];
  value: TOption[];
  onChange: (newValue: TOption[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {props.options.map((option) => {
        const isSelected = props.value.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              props.onChange(
                isSelected
                  ? props.value.filter((x) => x !== option)
                  : [...props.value, option],
              );
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              isSelected
                ? "border-black bg-zinc-200 text-black"
                : "border-zinc-300 text-zinc-600 hover:bg-zinc-200",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
