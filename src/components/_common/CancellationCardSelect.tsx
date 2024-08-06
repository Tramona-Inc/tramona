import { type CancellationPolicy } from "@/server/db/schema";
import { cn } from "@/utils/utils";
import React from "react";

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, index) => (
    <span key={index} className="block">
      <span style={{ color: "#000000", fontWeight: "bold" }}>
        {line.split(":")[0]}:
      </span>
      <span style={{ color: "#343434" }}>
        {line.includes(":") && line.split(":")[1]}
      </span>
    </span>
  ));
}

export default function CancellationCardSelect({
  policy,
  text,
  onClick,
  isSelected,
}: {
  policy: CancellationPolicy;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <button
      className={cn(
        "block w-full rounded-xl border-2 px-6 py-3 text-left",
        isSelected ? "border-black" : "hover:border-zinc-400",
      )}
      onClick={onClick}
    >
      <p className="text-center text-lg font-bold">{policy}</p>
      {isSelected ? (
        <p className="whitespace-pre-line text-left text-sm text-muted-foreground">
          {policy === "Non-refundable" ? text : formatText(text)}
        </p>
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
