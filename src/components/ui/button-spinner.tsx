import React from "react";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/utils/utils";
import { useButtonContext } from "./button";

export function ButtonSpinner() {
  const context = useButtonContext();

  return (
    <Loader2Icon
      className={cn("h-4 w-4 animate-spin", !context.isLoading && "hidden")}
    />
  );
}
