import { cn } from "@/utils/utils";
import React from "react";

export default function CancellationCardSelect({
  title,
  text,
  onClick,
  isSelected,
}: {
  title: string;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
}) {

  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <span key={index} className="block">
        <span style={{ color: '#000000', fontWeight: 'bold' }}>
          {line.split(":")[0]}:
        </span>
        <span style={{ color: '#343434' }}>
          {line.includes(":") && line.split(":")[1]}
        </span>
      </span>
    ));
  };

  return (
    <button
      className={cn(
        "block w-full rounded-xl border-2 p-5 space-y-3",
        isSelected ? "border-black" : "hover:border-zinc-400",
      )}
      onClick={onClick}
    >
      <p className="font-bold md:text-xl">{title}</p>
      {isSelected ? (
        <p className="text-left text-sm text-muted-foreground whitespace-pre-line">{formatText(text)}</p>
      ) : (
        <p
          className={cn(
            "overflow-hidden text-sm text-muted-foreground",
            "line-clamp-1",
          )}
        >
          {text}
        </p>
      )}
    </button>
  );
}
