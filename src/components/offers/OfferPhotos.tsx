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
      className="w-full md:w-[600px] md:h-[700px] lg:h-[750px] lg:w-[800px] "
    >
      <CarouselContent className="">
        {propertyImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1" >
              <Card className="min-h-[700px] border-none bg-transparent shadow-none flex items-center ">
                <CardContent className="">
                  <div className="flex items-center">
                    <Image
                      src={
                        propertyImages && propertyImages.length > 0 ? image : ""
                      }
                      alt="Property Image"
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
      <CarouselPrevious className="h-[50px] w-[50px] -ml-6"/>
      <CarouselNext className="h-[50px] w-[50px] -mr-6" />
    </Carousel>
  );
}
