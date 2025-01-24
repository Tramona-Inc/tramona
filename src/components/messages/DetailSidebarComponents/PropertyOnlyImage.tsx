import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generateBookingUrl } from "@/utils/utils";

interface ImageCarouselProps {
  property?: {
    id: number;
    imageUrls: string[] | undefined;
  };
}

const PropertyOnlyImage: React.FC<ImageCarouselProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (
      property?.imageUrls &&
      currentImageIndex < property.imageUrls.length - 1
    ) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!property) return <ImagesLoadingState />;

  const url = generateBookingUrl(property.id);

  if (!property.imageUrls || property.imageUrls.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <Link href={url}>
      <div className="relative z-20 mx-auto h-[calc(50vh-4rem)] overflow-hidden rounded-xl">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {property.imageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-2xl"
            >
              <Image
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  console.error(
                    `Error loading image for property with url ${imageUrl}:`,
                    e,
                  );
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
                className="rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
        {currentImageIndex > 0 && (
          <Button
            onClick={prevImage}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-90 p-2 hover:bg-opacity-100"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </Button>
        )}
        {currentImageIndex < property.imageUrls.length - 1 && (
          <Button
            onClick={nextImage}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-90 p-2 hover:bg-opacity-100"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </Button>
        )}
      </div>
    </Link>
  );
};

export default PropertyOnlyImage;

function ImagesLoadingState() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-200">
      <div className="h-full w-full animate-pulse">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
