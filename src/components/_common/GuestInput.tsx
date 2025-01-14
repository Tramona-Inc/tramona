import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InputButton } from "@/components/ui/input-button";
import { Plus, Minus } from "lucide-react";
import { type InputVariant } from "@/components/ui/input";

interface GuestInputProps {
  className?: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  value: number;
  onChange: (value: number) => void;
  minGuests?: number;
  maxGuests?: number;
}

export default function GuestInput({
  className,
  label,
  placeholder = "Select guests",
  variant,
  icon,
  value,
  onChange,
  minGuests = 1,
  maxGuests = 99,
}: GuestInputProps) {
  const [open, setOpen] = React.useState(false);

  const handleIncrement = () => {
    if (value < maxGuests) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > minGuests) {
      onChange(value - 1);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className="flex h-full items-center justify-center p-0"
      >
        <InputButton
          className={className}
          placeholder={placeholder}
          variant={variant}
          label={label}
          icon={icon}
          value={`${value} ${value === 1 ? "Guest" : "Guests"}`}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-64 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg backdrop-blur-md md:w-auto"
        align="center"
        side="bottom"
        avoidCollisions={false}
      >
        <div className="flex items-center justify-between space-x-6">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-[#004236] text-[#004236] hover:bg-white hover:text-[#006a56]"
            onClick={handleDecrement}
            disabled={value <= minGuests}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="min-w-[3rem] text-center font-medium text-[#004236]">
            {value} {value === 1 ? "Guest" : "Guests"}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full border-[#004236] text-[#004236] hover:bg-white hover:text-[#006a56]"
            onClick={handleIncrement}
            disabled={value >= maxGuests}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
