"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { api } from "@/utils/api";

interface EditBooleanFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  value: boolean;
}

export default function EditBooleanFieldDialog({
  open,
  onOpenChange,
  title,
  description,
  value,
}: EditBooleanFieldDialogProps) {
  const { mutateAsync: updateShowDecade } =
    api.users.updateProfileShowDecadeBorn.useMutation();

  const [switchValue, setSwitchValue] = useState(value);

  useEffect(() => {
    setSwitchValue(value);
  }, [value]);

  const handleSave = async () => {
    await updateShowDecade(switchValue);
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
        <div className="flex items-center justify-between space-y-4 py-4">
          <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
