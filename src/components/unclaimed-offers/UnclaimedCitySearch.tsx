import PlacesInput from "@/components/_common/PlacesInput";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputButton } from "@/components/ui/input-button";
import PlacesPopover from "../_common/PlacesPopover";
import { useState } from "react";
export const UnclaimedCitySearchSchema = z.object({
  city: z.string(),
});
type FormSchemaType = z.infer<typeof UnclaimedCitySearchSchema>;

function UnclaimedCitySearch() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(UnclaimedCitySearchSchema),
    defaultValues: {
      city: "",
    },
  });
  const [open, setOpen] = useState(false);
  return (
    <Form {...form}>
      <form>
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-black "> Search city </FormLabel>
                <div className="flex flex-row gap-x-1">
                  <Input />
                  <Button type="submit" variant="greenPrimary">
                    <SearchIcon />
                  </Button>
                </div>
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
export default UnclaimedCitySearch;
