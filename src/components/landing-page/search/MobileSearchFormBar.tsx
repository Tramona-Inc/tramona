import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFormBar } from './SearchFormBar';
import type { UseFormReturn } from 'react-hook-form';
import { type SearchFormValues } from './schemas';
import { locations } from './locations';

interface MobileSearchFormBarProps {
  form: UseFormReturn<SearchFormValues, unknown, SearchFormValues>;
  onSubmit: (values: SearchFormValues) => Promise<void> | void;
  isLoading: boolean;
}

export function MobileSearchFormBar({
  form,
  onSubmit,
  isLoading,
}: MobileSearchFormBarProps) {
  const [open, setOpen] = React.useState(false);
  const location = form.watch('location');
  const checkIn = form.watch('checkIn');
  const checkOut = form.watch('checkOut');
  const numGuests = form.watch('numGuests');

  const getDisplayText = () => {
    if (location) {
      return location;
    }
    return 'Best prices on Airbnbs anywhere';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = form.getValues();
    await onSubmit(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full rounded-full border border-gray-200 bg-white p-0 shadow-md hover:shadow-lg lg:hidden"
        >
          <div className="flex w-full items-center px-6 py-3">
            <Search className="mr-4 h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{getDisplayText()}</span>
              {(checkIn ?? checkOut ?? numGuests) && (
                <span className="text-xs text-gray-500">
                  {[
                    checkIn && new Date(checkIn).toLocaleDateString(),
                    checkOut && new Date(checkOut).toLocaleDateString(),
                    numGuests && `${numGuests} guest${numGuests !== 1 ? 's' : ''}`
                  ].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 h-[90vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="p-4 space-y-6">
            <h2 className="text-lg font-semibold">Where to?</h2>
            <Form {...form}>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Location Select */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 p-4 pl-10">
                              <SelectValue placeholder="Search destinations" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="h-48 overflow-y-auto">
                            {locations.map((location) => (
                              <SelectItem
                                key={location.name}
                                value={location.name}
                              >
                                {location.name}, {location.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <SearchFormBar
                    form={form}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    variant="modal"
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MobileSearchFormBar;