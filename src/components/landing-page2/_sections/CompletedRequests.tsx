import Marquee from "src/components/_common/MarqueeVertical";
import Image from "next/image";

const completedRequests = [
  {
    location: "Malfa, SI",
    originalPrice: 148,
    tramonaPrice: 105,
    image: "/assets/images/fake-completed-requests/1L.jpg",
  },
  {
    location: "Cancun, MX",
    originalPrice: 547,
    tramonaPrice: 438,
    image: "/assets/images/fake-completed-requests/2L.jpg",
  },
  {
    location: "Mammoth, CA",
    originalPrice: 1034,
    tramonaPrice: 818,
    image: "/assets/images/fake-completed-requests/3L.jpg",
  },
  {
    location: "Kotor, ME",
    originalPrice: 164,
    tramonaPrice: 132,
    image: "/assets/images/fake-completed-requests/4L.jpg",
  },
  {
    location: "Sayulita, MX",
    originalPrice: 377,
    tramonaPrice: 202,
    image: "/assets/images/fake-completed-requests/5R.jpg",
  },
  {
    location: "Vik, IS",
    originalPrice: 656,
    tramonaPrice: 513,
    image: "/assets/images/fake-completed-requests/6R.jpg",
  },
  {
    location: "Paso Robles, CA",
    originalPrice: 208,
    tramonaPrice: 158,
    image: "/assets/images/fake-completed-requests/7R.jpg",
  },
  {
    location: "Nashville, TN",
    originalPrice: 655,
    tramonaPrice: 400,
    image: "/assets/images/fake-completed-requests/8R.jpg",
  },
];

const leftImages = completedRequests.slice(0, completedRequests.length / 2);
const rightImages = completedRequests.slice(completedRequests.length / 2);

const PropertyCard = ({
  property,
}: {
  property: {
    image: string;
    location: string;
    tramonaPrice: number;
    originalPrice: number;
  };
}) => {
  return (
    <div className="relative mb-4 w-full">
      <Image
        className="h-auto w-full rounded-lg"
        width={300}
        height={200}
        alt=""
        src={property.image}
      />
      <div className="mt-2">
        <p className="text-sm font-bold">{property.location}</p>
        <div className="flex items-center">
          <span className="text-sm font-semibold">
            ${property.tramonaPrice}
          </span>
          <span className="ml-2 text-sm text-gray-500 line-through">
            ${property.originalPrice}
          </span>
          <span className="ml-2 rounded bg-primaryGreen px-2 py-1 text-xs text-white">
            {Math.round(
              ((property.originalPrice - property.tramonaPrice) /
                property.originalPrice) *
                100,
            )}
            % off
          </span>
        </div>
      </div>
    </div>
  );
};

export default function CompletedRequestsSection() {
  return (
    <div className="relative flex h-[500px] flex-row items-center justify-center overflow-hidden sm:px-20">
      <Marquee pauseOnHover vertical className="[--duration:20s]">
        {leftImages.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover vertical className="[--duration:20s]">
        {rightImages.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 from-white dark:from-background lg:bg-gradient-to-b"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 from-white dark:from-background lg:bg-gradient-to-t"></div>
    </div>
  );
}
