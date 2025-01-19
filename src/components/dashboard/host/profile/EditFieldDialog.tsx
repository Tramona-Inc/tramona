"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  value: string | boolean | null;
  onChange: (value: string | boolean | null) => void;
  maxLength?: number;
}

export function EditFieldDialog({
  open,
  onOpenChange,
  title,
  description,
  value,
  onChange,
  maxLength = 40,
}: EditFieldDialogProps) {
  const [inputValue, setInputValue] = useState(value);
  const remainingChars =
    typeof inputValue === "string" ? maxLength - inputValue.length : maxLength;

  const handleSave = () => {
    onChange(inputValue);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>
        {typeof inputValue !== "boolean" && (
          <div className="space-y-4 py-4">
            <Input
              value={inputValue ? inputValue : undefined}
              onChange={(e) => setInputValue(e.target.value)}
              maxLength={maxLength}
              className="w-full"
            />
            <div className="text-right text-xs text-muted-foreground">
              {remainingChars} characters available
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
