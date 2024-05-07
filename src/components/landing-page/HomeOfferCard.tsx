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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

function Dot({ isCurrent }: { isCurrent: boolean }) {
  return (
    <div
      className={cn(
        "h-3 w-3 rounded-full border border-white",
        isCurrent ? "h-4 w-4 bg-white" : "bg-transparent",
      )}
    ></div>
  );
}

function CarouselDots({ count, current }: { count: number; current: number }) {
  return (
    <div className="absolute bottom-10 flex w-full justify-center">
      <div className=" flex items-center gap-2 rounded-full bg-zinc-300/25 px-3 py-1">
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
        <p>
          <span className="text-xs">Airbnb Price: </span>
          {formatCurrency(property.originalNightlyPrice ?? 0)}
          <span className="text-xs">/night</span>
        </p>
      </div>
      <p className="text-xs">
        {property.maxNumGuests} guests, {property.numBedrooms} bedrooms,{" "}
        {property.numBeds} beds, {property.numBathrooms} baths
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
            <DialogTrigger asChild>
              <Button
                type={"submit"}
                className="w-full rounded-xl"
                disabled={!form.formState.isValid}
              >
                Make Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="flex sm:max-w-lg  md:max-w-fit md:px-36 md:py-10">
              <MakeBid propertyId={property.id} />
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
