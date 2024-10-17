import { api } from "@/utils/api";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

export function ScrapersTrigger() {
  const form = useZodForm({
    schema: z.object({
      numOfOffers: z.preprocess(
        (val) => Number(val),
        z.number().int().positive(),
      ),
    }),
    reValidateMode: "onSubmit",
  });

  const { mutateAsync: scrapeUnclaimedOffers } =
    api.offers.scrapeUnclaimedOffers.useMutation();

  const onSubmit = form.handleSubmit(async ({ numOfOffers }) => {
    await scrapeUnclaimedOffers({ numOfOffers })
      .then((scrapedListings) => {
        if (scrapedListings.length === 0) {
          toast({
            title: `Scraped nothing`,
          });
        } else {
          toast({
            title: `Successfully scraped ${scrapedListings.length} listings`,
          });
        }
        form.reset();
      })
      .catch(() => errorToast("Failed to scrape listings, please try again"));
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrape offers</CardTitle>
        <CardDescription>
          Scrape the offers in random dates in normal distribution (mean =
          3days, stdDev = 1day) in the near future (90 days). It will take some
          time (longer than 20s) to run the scraper. The number of scraped
          offers may be less or more than the number you input.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <FormField
              control={form.control}
              name="numOfOffers"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value as number} // Type assertion
                      placeholder="Input the number of offers you want"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Scrape</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
