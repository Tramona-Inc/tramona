import DateRangePicker from "@/components/_common/DateRangePicker";
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
import { Form } from "@/components/ui/form";
import { useBidding } from "@/utils/store/bidding";
import { cn, formatCurrency } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import MakeBid from "./bidding/MakeBid";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { plural } from "@/utils/utils";

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

export default function HomeOfferCard({
  property,
}: {
  property: PropertyCard;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

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

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

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
      <Carousel setApi={setApi}>
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
            {formatCurrency(AVG_AIRBNB_MARKUP * property.originalNightlyPrice, {
              round: true,
            })}
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
          <DateRangePicker
            control={form.control}
            name="date"
            formLabel=""
            className="col-span-full sm:col-span-1"
            propertyId={property.id}
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
              <MakeBid propertyId={property.id} />
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
