import { Link2 } from "lucide-react";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { CityRequestForm } from "../landing-page/SearchBars/useCityRequestForm";
import { Button } from "../ui/button";

export function AddAirbnbLink({
  form,
  curTab,
}: {
  form: CityRequestForm;
  curTab: number;
}) {
  return (
    <div className="grid grid-rows-2 gap-2 lg:flex lg:flex-row lg:space-x-1">
      <div className="lg:flex-grow">
        <FormField
          control={form.control}
          name={`data.${curTab}.airbnbLink`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Paste property link here"
                  className="h-11 w-full"
                  icon={Link2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="">
        <div className="hidden lg:block">
          <Button size="lg" type="submit" className="bg-[#004236] text-white">
            Submit
          </Button>
        </div>
        <div className="lg:hidden">
          <Button type="submit" className="w-full bg-[#004236] hover:bg-teal-950 text-white">
            Submit Request
          </Button>
        </div>
      </div>
    </div>
  );
}
