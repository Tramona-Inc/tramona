import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type Property } from "@/server/db/schema";
import { useBidding } from "@/utils/store/bidding";
import { formatCurrency } from "@/utils/utils";
import { zodNumber } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  price: zodNumber({ min: 1 }),
  guest: zodNumber({ min: 1 }),
});

type FormSchema = z.infer<typeof formSchema>;

function BiddingStep1({ property }: { property: Property }) {
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);

  const setPrice = useBidding((state) => state.setPrice);
  const price = useBidding((state) => state.price);

  const setGuest = useBidding((state) => state.setGuest);
  const guest = useBidding((state) => state.guest);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: price ?? undefined,
      guest: guest ?? undefined,
    },
  });

  function onSubmit(values: FormSchema) {
    setPrice(values.price);
    setGuest(values.guest);
    setStep(step + 1);
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="text-lg font-semibold tracking-tight md:text-3xl">
        Step 1 of 2: Make an offer
      </h1>
      <div className="mt-10 h-56 w-56">
        <AspectRatio
          ratio={1 / 1}
          className="relative flex items-center justify-center"
        >
          <Image
            src={property.imageUrls[0]!}
            alt="Property Photo"
            fill
            className="rounded-xl object-cover"
          />
        </AspectRatio>
      </div>

      <h2 className="mt-2 text-lg font-semibold">{property.name}</h2>
      <p className="my-3 text-sm">
        Airbnb&apos;s Price:{" "}
        {formatCurrency(property?.originalNightlyPrice ?? 0)}
        /night
      </p>
      <div className="border-2 border-dashed border-accent px-24 py-2">
        {/* Change this to reccomended price */}
        <p>$100 </p>
      </div>
      <p className="my-2 text-sm">Recommended Price</p>
      <div className=" flex w-5/6 flex-row text-accent">
        <div className="mt-3 w-full border-t border-accent" />
        <span className="mx-4 text-muted-foreground">or</span>
        <div className="mt-3 w-full border-t border-accent" />
      </div>
      <div className="item-center flex flex-col justify-center gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5 w-full">
              <p className="mb-2 font-semibold">Name your price</p>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="decimal"
                        prefix="$"
                        suffix="/night"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="mb-2 mt-5 font-semibold">Number of guests</p>
              <FormField
                control={form.control}
                name="guest"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button className="mb-1 px-32" type="submit">
              Review offer
            </Button>
          </form>
        </Form>
        <p className=" mb-5 text-xs text-muted-foreground md:text-sm">
          Payment information will be taken in the next step
        </p>
      </div>
      {/* we need to create a new end point /properties/properties[id] */}
      <Link
        href={`/property/${property.id}`}
        className="flex flex-row items-center text-sm font-light md:text-base"
      >
        <a>View full propery details</a>
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}

export default BiddingStep1;
