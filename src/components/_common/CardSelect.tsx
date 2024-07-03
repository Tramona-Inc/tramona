import { cn } from "@/utils/utils";
import React from "react";

export default function CardSelect({
  children,
  title,
  text,
  onClick,
  isSelected,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex flex-row items-center gap-5 rounded-xl border-2 p-5",
        isSelected ? "border-black" : "hover:border-zinc-400",
      )}
      onClick={onClick}
    >
      <div className="flex w-16 justify-center">{children}</div>
      <div className="w-full">
        <p className="font-semibold md:text-xl">{title}</p>
        <p className="text-sm text-muted-foreground md:text-lg">{text}</p>
      </div>
    </button>
  );
}
