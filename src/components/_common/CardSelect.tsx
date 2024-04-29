import { cn } from "@/utils/utils";
import React from "react";

export default function CardSelect({
  children,
  title,
  text,
  onClick,
  isSelected,
  hover,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        hover && "hover:border-black",
        `flex cursor-pointer flex-row items-center gap-5 rounded-[12px] border-[2px] p-5 transition-all sm:p-6 lg:p-7 ${
          isSelected ? "border-black" : ""
        }`,
      )}
      onClick={onClick}
    >
      <div className="flex w-16 justify-center">{children}</div>
      <div>
        <p className="font-semibold md:text-xl">{title}</p>
        <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
      </div>
    </div>
  );
}
