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
  indexOfSelectedImage?: number;
}
export default function OfferPhotos({
  propertyImages = [],
  indexOfSelectedImage,
}: OfferPhotoProps) {
  //convertes the indexOf theSelectedImage to 0 and then the remaining will follow then all the index prior will be added after
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        startIndex: indexOfSelectedImage,
      }}
      className="w-full md:h-[700px] md:w-[600px] lg:h-[750px] lg:w-[800px] "
    >
      <CarouselContent>
        {propertyImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="flex min-h-[700px] items-center border-none bg-transparent shadow-none">
                <CardContent>
                  <div className="flex items-center">
                    <Image
                      src={image}
                      alt="Property Image"
                      fill
                      objectFit="contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-ml-6 h-[50px] w-[50px]" />
      <CarouselNext className="-mr-6 h-[50px] w-[50px]" />
    </Carousel>
  );
}
