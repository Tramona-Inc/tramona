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
import { api } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { useBidding } from "@/utils/store/bidding";
import { formatCurrency, plural } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CarouselDots } from "../_common/carousel-dots";
import DateRangePicker from "../_common/DateRangePicker";
import { Button } from "../ui/button";
import MakeBid from "./bidding/MakeBid";

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

  const propertyIdBids = useBidding((state) => state.propertyIdBids);
  const propertyIdBucketList = useBidding(
    (state) => state.propertyIdBucketList,
  );
  const addToBucketListStore = useBidding(
    (state) => state.addPropertyIdBucketList,
  );
  const removeFromBucketListStore = useBidding(
    (state) => state.removePropertyIdFromBucketList,
  );

  const alreadyBid = propertyIdBids.includes(property.id);
  const inBucketList = propertyIdBucketList.includes(property.id);

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

  const [isInBucketList, setIsInBucketList] = useState(inBucketList);

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

  function handleAddToBucketList() {
    addPropertyToBucketList({
      propertyId: property.id,
    });
    addToBucketListStore(property.id);
  }

  function handleRemoveBucketList() {
    removePropertyFromBucketList(property.id);
    removeFromBucketListStore(property.id);
  }

  return (
    <div className="relative">
      <div className="space-y-2">
        <Carousel setApi={setCarouselApi}>
          <CarouselContent>
            {property.imageUrls.slice(0, 5).map((photo, index) => (
              <CarouselItem key={index}>
                <CardContent>
                  <Link href={`/property/${property.id}`}>
                    <Image
                      src={photo}
                      height={500}
                      width={500}
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
      <div className="absolute right-2 top-2">
        {!isInBucketList && (
          <Button
            tooltip={
              isLoggedIn ? undefined : "Please log in to add to bucket list"
            }
            onClick={() => (isLoggedIn ? handleAddToBucketList() : signIn())}
            variant="white"
            className="rounded-full"
          >
            <Plus />
            Add to bucket list
          </Button>
        )}
        {isInBucketList && (
          <Button
            onClick={() => handleRemoveBucketList()}
            className="rounded-full bg-[#333333]/90 hover:bg-[#333333]"
          >
            Added to bucket list
          </Button>
        )}
      </div>
    </div>
  );
}
