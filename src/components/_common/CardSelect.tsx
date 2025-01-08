import { cn } from "@/utils/utils";
import React from "react";

export default function CardSelect({
  children,
  title,
  text,
  onClick,
  isSelected,
  recommended,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
  recommended?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex flex-row items-center gap-5 rounded-xl border-2 p-5 hover:cursor-pointer",
        isSelected ? "border-black" : "hover:border-zinc-400",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex w-16 justify-center">{children}</div>
      <div className="w-full space-y-1">
        <div className="text-left font-semibold md:text-xl">{title}</div>
        <p className="text-left text-sm text-muted-foreground md:text-lg">
          {text}
        </p>
        {recommended && (
          <p className="text-left font-bold text-teal-900">Recommended</p>
        )}
      </div>
    </button>
  );
}
