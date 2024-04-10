import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Container } from "@react-email/components";
import Image from "next/image";
import OfferPhotos from "@/components/offers/OfferPhotos";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const photos = [
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/3b0c4129-696a-4b08-8896-3c05d9c729b5.jpeg?im_w=1200",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/1835c668-975c-498a-8773-e2ea4b13102f.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/a356750d-26b8-4c5a-ac27-2bce4a145694.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/6ad57d33-d0dd-492c-96e4-a1ad2f3184bc.jpeg?im_w=720",
  "https://a0.muscache.com/im/pictures/miso/Hosting-710092666168276467/original/680b68ad-8ec1-4724-8c74-f588dc8286bc.jpeg?im_w=720",
];

export default function homeOfferCard() {
  return (
    <MainLayout>
      <Container>
        <div>
          <div className="flex justify-center">
            <Carousel className="w-full max-w-xs">
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
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="flex justify-between font-bold">
            <p>Milan, Italy</p>
            <p>Price on Airbnb: $$$</p>
          </div>
          <p>4 guests, 2 bedrooms, 2 beds, 2 baths</p>
          <div>Check in / out input</div>
          <Button className="w-full">Make offer</Button>
        </div>
      </Container>
    </MainLayout>
  );
}
