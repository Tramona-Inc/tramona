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
import {
  DialogContentLarge,
  DialogLarge,
  DialogTrigger,
} from "@/components/ui/dialogLarge";
import { Form } from "@/components/ui/form";
import { type Property } from "@/server/db/schema";
<<<<<<< HEAD
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MakeBid from "./bidding/MakeBid";

const photos = [
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/3b0c4129-696a-4b08-8896-3c05d9c729b5.jpeg?im_w=1200",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/1835c668-975c-498a-8773-e2ea4b13102f.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/a356750d-26b8-4c5a-ac27-2bce4a145694.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/6ad57d33-d0dd-492c-96e4-a1ad2f3184bc.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/680b68ad-8ec1-4724-8c74-f588dc8286bc.jpeg?im_w=720",
];

=======
import { useBidding } from "@/utils/store/bidding";
import { cn, formatCurrency } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import MakeBid from "./bidding/MakeBid";

>>>>>>> dev
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

export default function HomeOfferCard({ property }: { property: Property }) {
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
        from: z.date(),
        to: z.date(),
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

<<<<<<< HEAD
=======
  const setDate = useBidding((state) => state.setDate);
  const setStep = useBidding((state) => state.setStep);
  const step = useBidding((state) => state.step);
  const resetSession = useBidding((state) => state.resetSession);

  const [open, setOpen] = useState(false);

  async function onSubmit(values: FormSchema) {
    // Reset session if on new date
    resetSession();
    setOpen(true);
    setDate(values.date.from, values.date.to);
  }

>>>>>>> dev
  return (
    <div className="space-y-2">
      <Carousel setApi={setApi}>
        <CarouselContent>
<<<<<<< HEAD
          {property.imageUrls.map((photo, index) => (
            <CarouselItem key={index}>
              <CardContent>
                <Image
                  src={photo}
                  height={300}
                  width={300}
                  alt=""
                  objectFit="cover"
                  className="aspect-square w-full rounded-xl object-cover"
                />
=======
          {property.imageUrls.slice(0, 5).map((photo, index) => (
            <CarouselItem key={index}>
              <CardContent>
                <Link href={`/property/${property.id}`}>
                  <Image
                    src={photo}
                    height={300}
                    width={300}
                    alt=""
                    objectFit="cover"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </Link>
>>>>>>> dev
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
<<<<<<< HEAD
          <span className="text-xs">Airbnb Price: </span>$
          {property.originalNightlyPrice}
=======
          <span className="text-xs">Airbnb Price: </span>
          {formatCurrency(property?.originalNightlyPrice ?? 0)}
          <span className="text-xs">/night</span>
>>>>>>> dev
        </p>
      </div>
      <p className="text-xs">
        {property.maxNumGuests} guests, {property.numBedrooms} bedrooms,{" "}
        {property.numBeds} beds, {property.numBathrooms} baths
      </p>
      <Form {...form}>
<<<<<<< HEAD
        <DateRangePicker
          control={form.control}
          name="date"
          formLabel=""
          className="col-span-full sm:col-span-1"
        />
        <DialogLarge>
          <DialogTrigger className="w-full rounded-xl bg-foreground py-2 text-primary-foreground">
            Make Offer
          </DialogTrigger>
          <DialogContentLarge className=" sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
            <MakeBid property={property} />
          </DialogContentLarge>
        </DialogLarge>
=======
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
          <DialogLarge open={open} onOpenChange={setOpen}>
            <DialogTrigger className="">
              <Button
                type={"submit"}
                className="w-full rounded-xl"
                disabled={!form.formState.isValid}
              >
                Make Offer
              </Button>
            </DialogTrigger>
            <DialogContentLarge className="relative sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
              {step !== 0 && (
                <Button
                  variant={"ghost"}
                  className={cn("absolute left-2 top-2 md:left-4 md:top-4")}
                  onClick={() => {
                    if (step - 1 > -1) {
                      setStep(step - 1);
                    }
                  }}
                >
                  <ChevronLeft />
                </Button>
              )}
              <MakeBid property={property} />
            </DialogContentLarge>
          </DialogLarge>
        </form>
>>>>>>> dev
      </Form>
    </div>
  );
}
