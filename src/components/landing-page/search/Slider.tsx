import { useState } from "react";

interface SliderProps {
  onToggle?: (value: "price" | "book") => void;
  defaultValue?: "price" | "book";
  className?: string;
}

export default function SliderToggle({
  onToggle,
  defaultValue = "price",
  className = "",
}: SliderProps) {
  const [activeOption, setActiveOption] = useState<"price" | "book">(
    defaultValue,
  );

  const handleToggle = () => {
    const newValue = activeOption === "price" ? "book" : "price";
    setActiveOption(newValue);
    onToggle?.(newValue);
  };

  return (
    <div className={`mx-auto flex items-center justify-center ${className}`}>
      <div
        className="relative flex h-10 w-80 cursor-pointer items-center rounded-full bg-white p-[2px]"
        onClick={handleToggle}
      >
        {/* Sliding Background */}
        <div
          className={`absolute h-[calc(100%-4px)] w-[calc(50%-2px)] transform rounded-full bg-primaryGreen transition-transform duration-200 ease-in-out ${
            activeOption === "price" ? "translate-x-0" : "translate-x-full"
          }`}
        />

        {/* Text Labels */}
        <span
          className={`z-10 flex w-1/2 justify-center text-xs font-medium ${
            activeOption === "price" ? "text-white" : ""
          }`}
        >
          Name your price
        </span>
        <span
          className={`z-10 flex w-1/2 justify-center text-xs font-medium ${
            activeOption === "book" ? "text-white" : ""
          }`}
        >
          Book it now
        </span>
      </div>
    </div>
  );
}
