import React from "react";
import { cn } from "@/utils/utils";

interface CircleProps {
  step: number;
  currenttab: number;
}

const Circle: React.FC<CircleProps> = ({ step, currenttab }) => {
  return (
    <div className="flex flex-col items-center">
      {/* <div className="mt-6 h-4 w-4 items-center justify-center rounded-full bg-black" /> */}
      <div
        className={cn(
          "mt-6 h-4 w-4 items-center justify-center rounded-full transition-opacity  delay-300 duration-1000",
          step >= currenttab
            ? "rounded-full bg-black"
            : "border-[3px] border-black opacity-50",
        )}
      />

      <div
        className={cn(
          "-mb-9 mt-[6px]  w-[0.5px] flex-1 border  transition delay-75 duration-500",
          step > currenttab ? "border-black" : "boarder-[#BEBEBE]",
        )}
      />
    </div>
  );
};

export default Circle;
