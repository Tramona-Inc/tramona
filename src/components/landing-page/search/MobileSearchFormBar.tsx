import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { SearchFormBar } from './SearchFormBar';

const MobileSearchFormBar = ({ form, onSubmit, isLoading }) => {
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
            </div>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 h-[90vh] overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="p-4 space-y-6">
            <h2 className="text-lg font-semibold">Where to?</h2>
            <Form {...form}>
              <form onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit((data) => {
                  onSubmit(data);
                  setOpen(false);
                })(e);
              }}>
                <div className="space-y-6">
                  <SearchFormBar
                    form={form}
                    onSubmit={() => {}}
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
};

export default MobileSearchFormBar;