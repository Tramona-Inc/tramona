import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  imageUrls: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < imageUrls.length - 1) {
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
  if (!imageUrls || imageUrls.length === 0) {
      return <div>No images available</div>
    }

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-200">
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
        }}
      >
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative h-full w-full flex-shrink-0">
            <Image
              src={imageUrl}
              alt={`Property image ${index + 1}`}
              fill
              onError={(e) => {
                console.error(
                  `Error loading image for property with url ${imageUrl}:`,
                  e,
                );
                (e.target as HTMLImageElement).src = "/placeholder.jpg";
              }}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {currentImageIndex > 0 && (
        <Button
          onClick={prevImage}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 hover:bg-opacity-80"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </Button>
      )}
      {currentImageIndex < imageUrls.length - 1 && (
        <Button
          onClick={nextImage}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 hover:bg-opacity-80"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </Button>
      )}
    </div>
  );
};

export default ImageCarousel;