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
import { ChevronLeft, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import MakeBid from "./bidding/MakeBid";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { plural } from "@/utils/utils";
import { api as apiHelper } from "@/utils/api";
import { signIn, useSession } from "next-auth/react";

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

  const { data: isBucketListProperty } =
    apiHelper.profile.isBucketListProperty.useQuery({
      blPropertyId: property.id,
    });

  const [isInBucketList, setIsInBucketList] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (isBucketListProperty) {
      setIsInBucketList(isBucketListProperty);
    }
  }, [isBucketListProperty]);

  const { mutate: addPropertyToBucketList } =
    apiHelper.profile.addProperty.useMutation({
      onSuccess: () => {
        setIsInBucketList(true);
      },
    });

  const { mutate: removePropertyFromBucketList } =
    apiHelper.profile.removeProperty.useMutation({
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

  const [step, setStep] = useState(alreadyBid ? 1 : 0);

  return (
    <div className="relative">
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
              {formatCurrency(
                AVG_AIRBNB_MARKUP * property.originalNightlyPrice,
                { round: true },
              )}
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
              <DialogTrigger asChild>
                <Button
                  type={"submit"}
                  className="w-full rounded-xl"
                  disabled={!form.formState.isValid}
                >
                  Make Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="flex sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
                {step !== 0 && (
                  <Button
                    variant={"ghost"}
                    className={cn("absolute left-1 top-0 md:left-4 md:top-4")}
                    onClick={() => {
                      if (step - 1 > -1) {
                        setStep(step - 1);
                      }
                    }}
                  >
                    <ChevronLeft />
                  </Button>
                )}
                <MakeBid propertyId={property.id} />
              </DialogContent>
            </Dialog>
          </form>
        </Form>
      </div>

      <div className="absolute right-2 top-2">
        {!isInBucketList && (
          <Button
            tooltip={isLoggedIn ? undefined : "Sign in to add to bucket list"}
            onClick={() =>
              isLoggedIn
                ? addPropertyToBucketList({
                    propertyId: property.id,
                  })
                : signIn()
            }
            variant="white"
            className="rounded-full"
          >
            <Plus />
            Add to bucket list
          </Button>
        )}

        {isInBucketList && (
          <Button
            onClick={() => removePropertyFromBucketList(property.id)}
            className="rounded-full bg-[#333333]/90 hover:bg-[#333333]"
          >
            Added to bucket list
          </Button>
        )}
      </div>
    </div>
  );
}
