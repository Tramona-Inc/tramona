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
import { env } from "@/env";
import useTimeout from "@/utils/useTimeout";
import { cn } from "@/utils/utils";
import { Check } from "lucide-react";
import Script from "next/script";
import usePlaceAutocomplete from "use-places-autocomplete";
import { FormControl } from "../ui/form";
import { useEffect } from "react";

export default function PlacesPopover({
  value,
  onValueChange,
  autoFocus = false,
  trigger,
  className,
  open,
  setOpen,
  ...props
}: React.ComponentProps<typeof Popover> & {
  value: string;
  onValueChange: (value: string) => void;
  autoFocus?: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  className: string;
  trigger: (props: { disabled: boolean; value: string }) => React.ReactNode;
}) {
  const {
    ready,
    value: input,
    setValue: setInput,
    suggestions: { status: suggestionsLoading, data },
    clearSuggestions,
    init,
  } = usePlaceAutocomplete({
    callbackName: "PlacesAutocomplete",
    debounce: 300,
  });

  useTimeout(() => setOpen(autoFocus), 0);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = init;
      return () => {
        document.body.removeChild(script);
      };
    } else {
      init();
    }
  }, [init]);

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <FormControl>{trigger({ value, disabled: !ready })}</FormControl>
      </PopoverTrigger>
      <PopoverContent dontAnimate align="start" className={className}>
        <Command>
          <CommandInput
            value={input}
            onValueChange={(value) => {
              setInput(value);
              if (value === "" || data.length === 0) clearSuggestions();
            }}
            required
            placeholder="Search locations..."
          />
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
                        : "opacity-0"
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
