import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn, titleCase } from "@/utils/utils";
import { states } from "@/utils/data/states";
import { useDropdownStore } from "@/utils/store/dropdown";

import { type StateProps } from "./dropdown-types";

const StateDropdown = () => {
  const {
    countryValue,
    stateValue,
    openStateDropdown,
    setOpenStateDropdown,
    setStateValue,
  } = useDropdownStore();

  const SD = states as StateProps[];
  const S = SD.filter(
    (state) => state.country_name === titleCase(countryValue),
  );

  // Find the full name of the selected state code for display
  const selectedState = S.find((state) => state.state_code === stateValue);

  return (
    <Popover open={openStateDropdown} onOpenChange={setOpenStateDropdown}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openStateDropdown}
          className="w-full cursor-pointer justify-between border-border font-normal"
          disabled={!countryValue || S.length === 0}
        >
          {stateValue && selectedState ? (
            <div className="flex items-end gap-2">
              <span>{selectedState.name}</span>
            </div>
          ) : S.length === 0 ? (
            <span>No state/region available</span>
          ) : (
            <span>Select State/Region</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] rounded-[6px] border border-border p-0">
        <Command>
          <CommandInput placeholder="Search state/region..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              {S.map((state) => (
                <CommandItem
                  key={state.id}
                  value={state.name}
                  onSelect={() => {
                    setStateValue(state.state_code); // Store the state code (e.g., "CA")
                    setOpenStateDropdown(false);
                  }}
                  className="flex cursor-pointer items-center justify-between text-xs"
                >
                  <div className="flex items-end gap-2">
                    <span className="">{state.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      stateValue === state.state_code
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StateDropdown;
