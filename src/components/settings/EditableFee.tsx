import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";

interface EditableFeeProps {
  title: string;
  subtitle: string;
  value: number;
  onSave: (value: number) => void;
  helpText?: string;
  learnMoreLink?: string;
  showGuestCounter?: boolean;
  guestCount?: number;
  onGuestCountChange?: (count: number) => void;
}

export function EditableFee({
  title,
  subtitle,
  value,
  onSave,
  helpText,
  learnMoreLink,
  showGuestCounter = false,
  guestCount = 1,
  onGuestCountChange,
}: EditableFeeProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const [editGuestCount, setEditGuestCount] = React.useState(guestCount);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setEditGuestCount(guestCount);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
          {subtitle !== "Per stay" && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold">$</span>
            <Input
              type="number"
              value={editValue || ""}
              onChange={(e) => setEditValue(Number(e.target.value) || 0)}
              className="h-16 w-32 text-4xl font-semibold"
              min="0"
            />
          </div>

          {showGuestCounter && (
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between">
                <span>For each guest after</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setEditGuestCount(Math.max(1, editGuestCount - 1))
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center">{editGuestCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditGuestCount(editGuestCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {helpText && (
          <p className="text-muted-foreground">
            {helpText}
            {learnMoreLink && (
              <Button variant="link" className="h-auto px-1.5">
                Learn more
              </Button>
            )}
          </p>
        )}

        <div className="space-y-2">
          <Button className="w-full" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      className="cursor-pointer p-6 transition-colors hover:bg-accent/50"
      onClick={() => setIsEditing(true)}
    >
      <div className="space-y-6">
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <div>
          {subtitle !== "Per stay" && (
            <div className="mb-2 text-sm">{subtitle}</div>
          )}
          <div className="text-4xl font-semibold">${value}</div>
        </div>
        {helpText && (
          <p className="text-sm text-muted-foreground">
            {helpText}
            {learnMoreLink && (
              <Button variant="link" className="h-auto px-1.5 text-sm">
                Learn more
              </Button>
            )}
          </p>
        )}
      </div>
    </Card>
  );
}
