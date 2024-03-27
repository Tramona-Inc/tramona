import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface OfferPhotoProps {
  propertyImages?: string[];
}
export default function OfferPhotos({ propertyImages = [] }: OfferPhotoProps) {
  return (
    <Carousel className="w-full lg:w-[900px] ">
      <CarouselContent className="">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="min-h-[800px] bg-transparent border-none shadow-none">
                <CardContent className="">
                  <div className="shadow-lg">
                    <Image
                      src={
                        propertyImages && propertyImages.length > 0
                          ? propertyImages[0]
                          : ""
                      }
                      alt=""
                      fill
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
