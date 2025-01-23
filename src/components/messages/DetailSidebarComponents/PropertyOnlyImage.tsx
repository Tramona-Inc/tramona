import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  imageUrls: string[];
}

const PropertyOnlyImage: React.FC<ImageCarouselProps> = ({ imageUrls }) => {
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

  if (imageUrls.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className="relative h-[calc(50vh-2rem)] w-full overflow-hidden rounded-xl">
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
        }}
      >
        {imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-2xl" // Added overflow-hidden here
          >
            <Image
              src={imageUrl}
              alt={`Property image ${index + 1}`}
              fill
              quality={90} // Adjust as needed (1-100)
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                console.error(
                  `Error loading image for property with url ${imageUrl}:`,
                  e,
                );
                (e.target as HTMLImageElement).src = "/placeholder.jpg";
              }}
              className="rounded-xl object-cover" // Added to classname too to cover all bases
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

export default PropertyOnlyImage;
