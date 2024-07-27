import { cn } from "@/utils/utils";
import React from "react";
import { Badge } from "../ui/badge";
import { useIsSm } from "@/utils/utils";

export default function CardSelect({
  children,
  title,
  text,
  onClick,
  isSelected,
  recommended,
}: {
  children: React.ReactNode;
  title: string;
  text: string;
  onClick?: () => void;
  isSelected?: boolean;
  recommended?: boolean;
}) {
  const isSm = useIsSm();
  return (
    <button
      className={cn(
        "flex flex-row items-center gap-5 rounded-xl border-2 p-5",
        isSelected ? "border-black" : "hover:border-zinc-400",
      )}
      onClick={onClick}
    >
      {isSm ? (
        <>
          <div className="flex w-16 justify-center">{children}</div>
          <div className="w-full">
            <div className="flex flex-row gap-4">
              <p className="text-left font-semibold md:text-xl">
                {title}
                {recommended ? (
                  <span className="pl-2">
                    <Badge className="justify-center">recommended</Badge>
                  </span>
                ) : null}
              </p>
            </div>
            <p className="text-left text-sm text-muted-foreground md:text-lg">
              {text}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          <div className="mb-4 flex">
            {recommended ? <Badge className="">Recommended</Badge> : null}
          </div>
          <div className="flex flex-row gap-5">
            <div className="flex w-16 justify-center">{children}</div>
            <div className="w-full">
              <div className="flex flex-row gap-4">
                <p className="text-left font-semibold md:text-xl">{title}</p>
              </div>
              <p className="text-left text-sm text-muted-foreground md:text-lg">
                {text}
              </p>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
