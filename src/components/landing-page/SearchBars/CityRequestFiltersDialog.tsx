import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { type CityRequestForm } from "./useCityRequestForm";
import { OptionalFilter } from "./OptionalFilter";
import { Link2, ListFilter } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function CityRequestFiltersDialog({
  form,
  curTab,
  children,
}: {
  form: CityRequestForm;
  curTab: number;
  children: React.ReactNode;
}) {
  const [notes, setNotes] = useState("");

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    if (newValue.length <= 100) {
      setNotes(newValue);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[425px] bg-white lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Additional filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="lg:hidden space-y-1">
            <p className="text-sm">
              Have a property you like? We&apos;ll send your request directly to
              the host.
            </p>
            <div className="flex">
              <div className="basis-full">
                <FormField
                  control={form.control}
                  name={`data.${curTab}.airbnbLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Paste property link here (optional)"
                          className="w-full"
                          icon={Link2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="lg:hidden">
            <OptionalFilter form={form} curTab={curTab}>
              <Button
                variant="ghost"
                type="button"
                className="px-2 text-teal-900 hover:bg-teal-900/15"
              >
                <ListFilter />
              </Button>
            </OptionalFilter>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <FilterCheckbox label="Pool" />
            <FilterCheckbox label="Hot tub" />
            <FilterCheckbox label="A/C" />
            <FilterCheckbox label="Dedicated workspace" />
            <FilterCheckbox label="BBQ grill" />
            <FilterCheckbox label="Smoking allowed" />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Additional notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Enter your additional notes here..."
            />
            <div className="text-sm text-gray-500">
              {notes.length}/100 characters
            </div>
          </div>
        </div>
        <Button className="w-full bg-[#004236] hover:bg-[#004236]/90">
          Save Filters
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function FilterCheckbox({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-2 rounded-md border px-2 py-3">
      <Checkbox id={label} />
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
