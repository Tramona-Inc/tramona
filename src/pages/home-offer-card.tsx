import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Container } from "@react-email/components";
import Image from "next/image";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import DateRangePicker from "@/components/_common/DateRangePicker";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const photos = [
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/3b0c4129-696a-4b08-8896-3c05d9c729b5.jpeg?im_w=1200",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/1835c668-975c-498a-8773-e2ea4b13102f.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/a356750d-26b8-4c5a-ac27-2bce4a145694.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/6ad57d33-d0dd-492c-96e4-a1ad2f3184bc.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/680b68ad-8ec1-4724-8c74-f588dc8286bc.jpeg?im_w=720",
];

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

export default function HomeOfferCard() {
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

  return (
    <MainLayout>
      <Container>
        <div className="space-y-2">
          <div className="flex justify-center">
            <Carousel className="relative w-full" setApi={setApi}>
              <CarouselContent>
                {photos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                            src={photo}
                            fill
                            alt=""
                            objectFit="cover"
                            className="rounded-lg border"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-10 top-1/2" />
              <CarouselNext className="absolute right-10 top-1/2" />
              <CarouselDots count={count} current={current} />
            </Carousel>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold">Milan, Italy</p>
            <p>Price on Airbnb: $$$</p>
          </div>
          <p>4 guests, 2 bedrooms, 2 beds, 2 baths</p>
          <Form {...form}>
            <DateRangePicker
              control={form.control}
              name="date"
              formLabel=""
              className="col-span-full sm:col-span-1"
            />
            <Button className="w-full font-bold" type="submit">
              Make offer
            </Button>
          </Form>
        </div>
      </Container>
    </MainLayout>
  );
}
