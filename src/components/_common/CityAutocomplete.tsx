import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useTimeout from "@/utils/useTimeout";
import { cn, useIsSm } from "@/utils/utils";
import { Check, MapPinIcon } from "lucide-react";
import usePlaceAutocomplete from "use-places-autocomplete";
import { FormControl } from "../ui/form";

export default function CityAutocomplete({
  value,
  onValueChange,
  autoFocus = false,
  trigger,
  className = "",
  open,
  setOpen,
  ...props
}: React.ComponentProps<typeof Popover> & {
  value: string;
  onValueChange: (value: string) => void;
  autoFocus?: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  className?: string;
  trigger: (props: { disabled: boolean; value: string }) => React.ReactNode;
}) {
  const {
    ready,
    value: input,
    setValue: setInput,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlaceAutocomplete({
    debounce: 300,
    requestOptions: {
      types: ["(cities)"], // Restricts results to cities only
      componentRestrictions: { country: "us" }, // Optional: Restrict to a specific country
    },
  });

  useTimeout(() => setOpen(autoFocus), 0);
  const isSm = useIsSm();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <FormControl>{trigger({ value, disabled: !ready })}</FormControl>
      </PopoverTrigger>
      <PopoverContent
        avoidCollisions={false}
        dontAnimate
        align={isSm ? "start" : "center"}
        side="bottom"
        className={cn(
          "z-0 rounded-lg border border-zinc-100 bg-white p-0 shadow-lg",
          className,
        )}
      >
        <Command>
          <CommandInput
            value={input}
            onValueChange={(value) => {
              setInput(value);
              if (!value || data.length === 0) clearSuggestions();
            }}
            required
            placeholder="Search for a city..."
          />
          {status === "OK" && (
            <CommandList className="p-1">
              {data.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.description}
                  onSelect={() => {
                    onValueChange(suggestion.description);
                    setInput(suggestion.description);
                    setOpen(false);
                  }}
                  className="flex rounded-md p-2 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <div className="flex flex-1 items-center">
                    <div className="mr-2 rounded-md bg-black/10 p-2">
                      <MapPinIcon className="h-5 w-5 text-zinc-800" />
                    </div>
                    <p className="line-clamp-1 flex-1">{suggestion.description}</p>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 flex-shrink-0",
                      suggestion.description === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          )}
          {input === "" && (
            <CommandGroup>
              <p className="py-3 text-center text-sm text-muted-foreground">
                Start typing to see city suggestions
              </p>
            </CommandGroup>
          )}
          {data.length === 0 && input !== "" && <CommandEmpty>No matching cities</CommandEmpty>}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
