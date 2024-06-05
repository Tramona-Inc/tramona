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
import { cn } from "@/utils/utils";
import { Check, MapPin } from "lucide-react";
import usePlaceAutocomplete from "use-places-autocomplete";
import { FormControl } from "../ui/form";
// import { MapPinIcon } from "lucide-react"

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
    // init,
  } = usePlaceAutocomplete({
    callbackName: "PlacesAutocomplete",
    debounce: 300,
    // initOnMount: false,
  });

  // const [open, setOpen] = useState(false);

  // useEffect(() => ..., []) was offsetting the popover a lil, idk why this works
  useTimeout(() => setOpen(autoFocus), 0);

  return (
    <>
      {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places&callback="PlacesAutocomplete"`}
        onLoad={init}
      /> */}

      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <FormControl>{trigger({ value, disabled: !ready })}</FormControl>
        </PopoverTrigger>
        <PopoverContent dontAnimate align="start" className={className}>
          <Command className="bg-white">
            <CommandInput
              value={input}
              onValueChange={(value) => {
                setInput(value);
                if (value === "" || data.length === 0) clearSuggestions();
              }}
              required
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
                    className="flex flex-row text-base h-12"
                    >
                    {/* <MapPin
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        suggestion.description === value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    /> */}
                      {/* <div className="flex flex-row space-x-2"> */}
                      <div className="content-around mr-2"><MapPin className="h-8 w-6 flex-shrink-0"/></div>
                      <div className="line-clamp-1 content-around">{suggestion.description}</div>
                      {/* </div> */}
                      
                    
                  </CommandItem>
                ))}
              </CommandList>
            )}
            {input === "" && (
              <CommandGroup>
                <p className="mt-2 text-center text-sm text-muted-foreground bg-white">
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
    </>
  );
}
