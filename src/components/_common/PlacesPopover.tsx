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
import { Check } from "lucide-react";
import { cn } from "@/utils/utils";
import { FormControl, FormField } from "../ui/form";
import { Button } from "../ui/button";
import usePlaceAutocomplete from "use-places-autocomplete";
import { type FieldPath, type FieldValues } from "react-hook-form";
import { useState } from "react";
import useTimeout from "@/utils/useTimeout";

export default function PlacesPopover({
  value,
  onValueChange,
  autoFocus = false,
  trigger,
  ...props
}: React.ComponentProps<typeof Popover> & {
  value: string;
  onValueChange: (value: string) => void;
  autoFocus?: boolean;
  trigger: (props: { disabled: boolean; value: string }) => React.ReactNode;
}) {
  const {
    ready,
    value: input,
    setValue: setInput,
    suggestions: { status: suggestionsLoading, data },
    clearSuggestions,
  } = usePlaceAutocomplete({ debounce: 300 });

  const [open, setOpen] = useState(false);

  // useEffect(() => ..., []) was offsetting the popover a lil, idk why this works
  useTimeout(() => setOpen(true), 0);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <FormControl>{trigger({ value, disabled: !ready })}</FormControl>
      </PopoverTrigger>
      <PopoverContent
        dontAnimate
        align="start"
        className="w-[100vw] -translate-y-12 overflow-clip px-0 pt-0 sm:w-72 sm:-translate-x-5"
      >
        <Command>
          <CommandInput
            value={input}
            onValueChange={(value) => {
              setInput(value);

              if (value === "" || data.length === 0) clearSuggestions();
            }}
            placeholder="Search locations..."
          />
          {/* {suggestionsLoading && (
									<CommandGroup>Loading suggestions...</CommandGroup>
								)} */}
          {suggestionsLoading === "OK" && (
            <CommandList>
              {data.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.description}
                  onSelect={() => {
                    onValueChange(suggestion.description);
                    setInput(suggestion.description);
                    setOpen(false);
                  }}
                  className="flex"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      suggestion.description === value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <p className="line-clamp-1">{suggestion.description}</p>
                </CommandItem>
              ))}
            </CommandList>
          )}
          {input === "" && (
            <CommandGroup>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Start typing to see suggestions
              </p>
            </CommandGroup>
          )}
          {data.length === 0 && input !== "" && (
            <CommandEmpty>No suggestions</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
