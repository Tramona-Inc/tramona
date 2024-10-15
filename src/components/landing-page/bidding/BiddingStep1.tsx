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
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
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
  watchedPrice: zodNumber({ min: 1 }),
  guest: zodNumber({ min: 1 }),
});

type FormSchema = z.infer<typeof formSchema>;

function BiddingStep1({
  property,
  setStep,
  setPrice,
}: {
  property: Property;
  setStep: (step: number) => void;
  setPrice: (price: number) => void;
}) {
  // const setStep = useBidding((state) => state.setStep);

  // const setPrice = useBidding((state) => state.setPrice);
  const currentPrice = useBidding((state) => state.price);

  const setGuest = useBidding((state) => state.setGuest);
  const guest = useBidding((state) => state.guest);
  //determine if user identity is verified
  // const { data: users } = api.users.myVerificationStatus.useQuery();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      watchedPrice: currentPrice,
      guest: guest,
    },
  });

  function onSubmit(values: FormSchema) {
    setPrice(values.watchedPrice);
    setGuest(values.guest);
    setStep(1);

    // if (users?.isIdentityVerified === "true") {
    //   setStep(1);
    // }
  }

  const threshhold = 1.2;

  const reccomendedPrice = property.originalNightlyPrice
    ? property.originalNightlyPrice / threshhold
    : 0;

  const { watchedPrice } = form.watch();

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
        {property.originalNightlyPrice
          ? formatCurrency(property.originalNightlyPrice * AVG_AIRBNB_MARKUP)
          : "Prices unavailable"}
        /night
      </p>
      <div className="border-2 border-dashed border-accent px-7 py-2 md:px-24">
        {/* Change this to reccomended price */}
        <p>
          {property.originalNightlyPrice
            ? formatCurrency(property.originalNightlyPrice)
            : "Estimate unavailable"}
        </p>
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
                name="watchedPrice"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="decimal"
                        autoFocus
                        prefix="$"
                        suffix="/night"
                      />
                    </FormControl>
                    <FormMessage />
                    {watchedPrice > 0 && watchedPrice <= reccomendedPrice / 100 && (
                      <p className="max-w-[300px] text-xs text-destructive">
                        You are unlikely to get this price, up your price for a
                        higher chance
                      </p>
                    )}
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
            {/* {users?.isIdentityVerified === "pending" ? (
              <div className="flex flex-col items-center">
                <p className=" mb-1 text-xs text-muted-foreground">
                  Verification takes about 1-3 minutes.
                </p>
                <div className="flex-row gap-x-1">
                  <Button
                    className=" flex flex-row items-center justify-center"
                    disabled
                  >
                    Verification Pending
                    <Loader2 className="animate-spin" />
                  </Button>
                </div>
              </div>
            ) : users?.isIdentityVerified === "true" ? (
              <Button className="mb-1 px-32" type="submit">
                Review offer
              </Button>
            ) : (
              <div className="flex flex-col items-center">
                <p className=" mb-1 text-xs text-muted-foreground">
                  You must be verified before submitting an offer.
                </p>
                <IdentityModal stripePromise={stripePromise} />
              </div>
            )} */}
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
