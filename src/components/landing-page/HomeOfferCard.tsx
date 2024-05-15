import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { useBidding } from "@/utils/store/bidding";
import { cn, formatCurrency, plural } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DateRangePicker from "../_common/DateRangePicker";
import { Button } from "../ui/button";
import MakeBid from "./bidding/MakeBid";
import { signIn, useSession } from "next-auth/react";
import { api } from "@/utils/api";

function Dot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "rounded-full transition-all duration-500",
        isCurrent ? "size-2.5 bg-white" : "size-1.5 bg-white/50",
      )}
    ></div>
  );
}

function CarouselDots({ count, current }: { count: number; current: number }) {
  return (
    <div className="pointer-events-none absolute bottom-2 flex w-full justify-center">
      <div className="flex h-4 items-center gap-2 rounded-full bg-black/40 p-1">
        {Array(count)
          .fill(null)
          .map((_, idx) => (
            <Dot key={idx} isCurrent={idx === current - 1} />
          ))}
      </div>
    </div>
  );
}
type PropertyCard = {
  id: number;
  imageUrls: string[];
  name: string;
  maxNumGuests: number;
  numBathrooms: number | null;
  numBedrooms: number;
  numBeds: number;
  originalNightlyPrice: number | null;
  distance: unknown;
};

const formSchema = z
  .object({
    date: z.object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    }),
  })
  .refine((data) => data.date.to > data.date.from, {
    message: "Must stay for at least 1 night",
    path: ["date"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default function HomeOfferCard({
  property,
}: {
  property: PropertyCard;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  const { data: isBucketListProperty } =
    api.profile.isBucketListProperty.useQuery({
      blPropertyId: property.id,
    });

  const [isInBucketList, setIsInBucketList] = useState(false);

  useEffect(() => {
    if (isBucketListProperty) {
      setIsInBucketList(isBucketListProperty);
    }
  }, [isBucketListProperty]);

  const { mutate: addPropertyToBucketList } =
    api.profile.addProperty.useMutation({
      onSuccess: () => {
        setIsInBucketList(true);
      },
    });

  const { mutate: removePropertyFromBucketList } =
    api.profile.removeProperty.useMutation({
      onSuccess: () => {
        setIsInBucketList(false);
      },
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const setDate = useBidding((state) => state.setDate);
  const resetSession = useBidding((state) => state.resetSession);

  const [open, setOpen] = useState(false);

  async function onSubmit(values: FormSchema) {
    // Reset session if on new date
    resetSession();
    setOpen(true);
    setDate(values.date.from, values.date.to);
  }

  const propertyIdBids = useBidding((state) => state.propertyIdBids);

  const alreadyBid = propertyIdBids.includes(property.id);

  return (
    <div className="space-y-2">
      <Carousel setApi={setCarouselApi}>
        <CarouselContent>
          {property.imageUrls.slice(0, 5).map((photo, index) => (
            <CarouselItem key={index}>
              <CardContent>
                <Link href={`/property/${property.id}`}>
                  <Image
                    src={photo}
                    height={300}
                    width={300}
                    alt=""
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </Link>
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="absolute left-2 top-1/2 size-6"
          variant={"white"}
        />
        <CarouselNext
          className="absolute right-2 top-1/2 size-6"
          variant={"white"}
        />
        <CarouselDots count={count} current={current} />
      </Carousel>
      <div className="flex flex-col">
        <p className="max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold">
          {property.name}
        </p>
        {property.originalNightlyPrice && (
          <p>
            <span className="text-xs">Airbnb Price: </span>
            {formatCurrency(AVG_AIRBNB_MARKUP * property.originalNightlyPrice)}
            <span className="text-xs">/night</span>
          </p>
        )}
      </div>
      <p className="text-xs">
        {plural(property.maxNumGuests, "guest")},{" "}
        {plural(property.numBedrooms, "bedroom")},{" "}
        {plural(property.numBeds, "bed")}
        {property.numBathrooms && (
          <>, {plural(property.numBathrooms, "bath")}</>
        )}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DateRangePicker
                    {...field}
                    propertyId={property.id}
                    disablePast
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            {/* Removed trigger to have control on open and close */}
            <div>
              {alreadyBid ? (
                <Button
                  type={"submit"}
                  className={"w-full rounded-xl"}
                  disabled={alreadyBid}
                >
                  Already Bid
                </Button>
              ) : (
                <Button
                  type={"submit"}
                  className={`w-full rounded-xl ${!form.formState.isValid && "bg-black"}`}
                  // disabled={!form.formState.isValid}
                >
                  Make Offer
                </Button>
              )}
            </div>
            <DialogContent className="flex sm:max-w-lg  md:max-w-fit md:px-36 md:py-10">
              <MakeBid propertyId={property.id} setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
