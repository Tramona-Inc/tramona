"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { FieldConfig } from "./fieldConfig";
import { api } from "@/utils/api";

export type FieldConfigKeys = keyof FieldConfig;

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  value: string | boolean | null | undefined;
  maxLength?: number;
  activeFieldConfig: FieldConfigKeys;
}

export function EditFieldDialog({
  open,
  onOpenChange,
  title,
  description,
  value,
  maxLength = 40,
  activeFieldConfig,
}: EditFieldDialogProps) {
  const { mutateAsync: updateField, isLoading } =
    api.users.updateUserFieldConfig.useMutation();

  const [inputValue, setInputValue] = useState<string | null | undefined>(
    value != null ? String(value) : undefined,
  );
  const remainingChars =
    typeof inputValue === "string" ? maxLength - inputValue.length : maxLength;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [setInputValue],
  );

  const handleSave = useCallback(async () => {
    await updateField({
      key: activeFieldConfig,
      description: inputValue ? inputValue : "",
    });
    onOpenChange(false);
  }, [updateField, activeFieldConfig, onOpenChange, inputValue]);

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await handleSave();
      }
    },
    [handleSave],
  );

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
              value={inputValue ?? undefined}
              onChange={handleInputChange}
              maxLength={maxLength}
              className="w-full"
              onKeyDown={handleKeyDown}
            />
            <div className="text-right text-xs text-muted-foreground">
              {remainingChars} characters available
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
