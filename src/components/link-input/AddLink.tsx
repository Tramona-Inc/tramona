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
    <div className="flex space-x-2">
      <div className="flex-grow">
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
      <Button type="submit" className="bg-[#004236] text-white">
        Submit
      </Button>
    </div>
  );
}