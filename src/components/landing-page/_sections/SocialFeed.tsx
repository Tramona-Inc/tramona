import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState, useRef } from "react";
import { getDiscountPercentage } from "@/utils/utils";

interface SocialCardProps {
  image: string;
  username: string;
  caption: string;
  location: string;
  userAvatar: string;
  originalPrice: number;
  tramonaPrice: number;
}

const SocialCard: React.FC<SocialCardProps> = ({
  image,
  username,
  caption,
  location,
  userAvatar,
  originalPrice,
  tramonaPrice,
}) => {
  return (
    <div className="mb-1 flex flex-col items-start overflow-hidden rounded-2xl border border-[#BFBFBF] bg-gray-400 bg-opacity-10 bg-clip-padding backdrop-blur-xl backdrop-filter lg:max-w-4xl">
      <div className="flex w-full">
        <div className="flex flex-grow flex-col justify-start p-4">
          <div className="mb-2 flex items-center">
            <div className="flex-shrink-0">
              <Avatar>
                <AvatarImage src={userAvatar} style={{ objectFit: "cover" }} />
                <AvatarFallback />
              </Avatar>
            </div>
            <div className="ml-4 flex flex-col justify-start">
              <div className="text-xs font-semibold text-gray-900 md:text-sm">
                {username}
              </div>
              <div className="text-xs text-gray-200">{location}</div>
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-900 md:text-sm">{caption}</p>
          </div>
        </div>
        <div className="relative hidden h-36 w-36 flex-shrink-0 md:block md:h-48 md:w-48 lg:h-48 lg:w-48">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width:640px) 50vw, 100vw"
            className="rounded-2xl object-cover p-2"
          />
        </div>
      </div>
      <div className="mb-0 mt-0 flex w-full items-center justify-between bg-white bg-opacity-50">
        <div className="mx-6 text-center text-secondary-foreground/50 md:mx-6">
          <p className="text-lg font-semibold line-through md:text-xl lg:text-3xl">
            ${originalPrice}
          </p>
          <p className="text-xs tracking-tight md:text-sm">Airbnb price</p>
        </div>
        <div className="text-center text-secondary-foreground/50">
          <p className="text-lg font-semibold text-primary md:text-xl lg:text-3xl">
            ${tramonaPrice}
          </p>
          <p className="text-xs tracking-tight md:text-sm">Our price</p>
        </div>
        <div className="mx-2 bg-primary px-2 py-2 text-zinc-50 md:mx-6 lg:px-5 lg:py-2">
          <p className="text-base font-semibold md:text-lg lg:text-xl">
            {getDiscountPercentage(originalPrice, tramonaPrice)}% OFF
          </p>
        </div>
      </div>
    </div>
  );
};

const cardData = [
  {
    image: "/assets/images/landing-page/pasorobles2.jpg",
    username: "Partha",
    caption:
      "We're never booking another trip again without Tramona. We got to stay in one of the coolest places in the area! 🍇",
    location: "Paso Robles, CA",
    userAvatar: "/assets/images/landing-page/pasorobles_user2.jpg",
    originalPrice: 208,
    tramonaPrice: 158,
  },
  {
    image: "/assets/images/landing-page/iceland.jpg",
    username: "Mac",
    caption: "",
    location: "Iceland",
    userAvatar: "/assets/images/landing-page/iceland_user.jpg",
    originalPrice: 390,
    tramonaPrice: 276,
  },
  {
    image: "/assets/images/landing-page/nyc.jpg",
    username: "Vikram",
    caption: "🥳🎉",
    location: "New York, NY",
    userAvatar: "/assets/images/landing-page/nyc_user.jpg",
    originalPrice: 163,
    tramonaPrice: 132,
  },
  {
    image: "/assets/images/landing-page/delmar.jpg",
    username: "Seth",
    caption: "Just wow 🙌",
    location: "Del Mar, CA",
    userAvatar: "/assets/images/landing-page/delmar_user.jpg",
    originalPrice: 475,
    tramonaPrice: 375,
  },
  {
    image: "/assets/images/landing-page/sayulita.jpg",
    username: "Dylan S.",
    caption: "",
    location: "Sayulita, Mexico",
    userAvatar: "/assets/images/landing-page/sayulita_user.jpg",
    originalPrice: 377,
    tramonaPrice: 175,
  },
  {
    image: "/assets/images/landing-page/pasorobles.jpg",
    username: "Lauren",
    caption: "California's hidden gem! 🌅 ",
    location: "Paso Robles, CA",
    userAvatar: "/assets/images/landing-page/pasorobles_user.jpg",
    originalPrice: 195,
    tramonaPrice: 175,
  },
  {
    image: "/assets/images/landing-page/nashville.jpg",
    username: "Jon F.",
    caption: "",
    location: "Nashville, TN",
    userAvatar: "/assets/images/landing-page/nashville_user.jpg",
    originalPrice: 900,
    tramonaPrice: 450,
  },
  {
    image: "/assets/images/landing-page/vail.jpg",
    username: "Angel",
    caption: "",
    location: "Vail, CO",
    userAvatar: "/assets/images/landing-page/vail_user.jpg",
    originalPrice: 454,
    tramonaPrice: 400,
  },
];

const InfiniteScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const surroundingBackup = 2;
  const [cardHeightPx, setCardHeightPx] = useState(200);

  useEffect(() => {
    const updateCardHeight = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setCardHeightPx(150);
      } else if (screenWidth < 768) {
        setCardHeightPx(175);
      } else if (screenWidth < 1920) {
        setCardHeightPx(200);
      } else {
        setCardHeightPx(255);
      }
    };

    updateCardHeight();
    window.addEventListener("resize", updateCardHeight);

    return () => window.removeEventListener("resize", updateCardHeight);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.style.height = `${3 * cardHeightPx}px`;
    }
  }, [cardHeightPx]);

  const handleScroll = () => {
    const container = scrollRef.current;
    const content = contentRef.current;

    if (container && content) {
      const contentHeight = content.offsetHeight;
      const backupHeight = contentHeight * surroundingBackup;

      if (container.scrollTop >= backupHeight + contentHeight) {
        container.scrollTop = backupHeight;
      } else if (container.scrollTop <= backupHeight - contentHeight) {
        container.scrollTop = backupHeight;
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    const content = contentRef.current;

    if (container && content) {
      const contentHeight = content.offsetHeight;
      container.scrollTop = contentHeight * surroundingBackup + 5;
    }
  }, [surroundingBackup]);

  return (
    <div className="relative overflow-hidden rounded-lg ">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-10 w-full bg-opacity-50 bg-gradient-to-b from-[#B8B8B6] to-transparent"></div>
      <div ref={scrollRef} className="h-full overflow-auto scrollbar-hide">
        {Array.from({ length: surroundingBackup }, (_, i) =>
          cardData.map((card, index) => (
            <SocialCard key={`pre-${i}-${index}`} {...card} />
          )),
        )}
        <div ref={contentRef}>
          {cardData.map((card, index) => (
            <SocialCard key={`original-${index}`} {...card} />
          ))}
        </div>
        {Array.from({ length: surroundingBackup }, (_, i) =>
          cardData.map((card, index) => (
            <SocialCard key={`post-${i}-${index}`} {...card} />
          )),
        )}
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-10 w-full bg-opacity-50 bg-gradient-to-t from-[#61605E] to-transparent"></div>
    </div>
  );
};

const SocialFeed: React.FC = () => {
  return (
    <>
      <section className="relative bg-white p-2 md:px-2">
        <div className="absolute inset-0 z-0 ">
          <Image
            src="/assets/images/landing-page/bg3.jpg"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="rounded-3xl p-2 md:px-2"
          />
        </div>
        <div className="relative z-10 flex flex-col-reverse items-start justify-center rounded-3xl p-8 text-white md:flex-row">
          <div className="w-full md:max-w-md md:flex-1 2xl:max-w-xl">
            <div className="shadow-inner-5xl z-10 shadow-black ">
              <InfiniteScroll />
            </div>
          </div>
          <div className="mb-4 w-full md:mb-0 md:max-w-lg md:flex-1 md:pl-16 lg:pl-28 2xl:max-w-2xl">
            <div className="rounded-3xl p-5">
              <h2 className="mb-4 text-5xl font-semibold text-neutral-900">
                Make. <span className="font-bold italic">More.</span> Memories.
              </h2>
            </div>
            <div className="relative mx-auto flex items-center justify-center p-5 sm:p-0 md:mt-2 lg:mt-2 2xl:mt-48">
              <div className="relative max-w-xl rounded-2xl bg-white px-4 py-2 text-neutral-900 shadow">
                <div className="text-left"></div>
                <p className="text-xl font-extralight text-neutral-900">
                  See your friends, connect with amazing places and faces,
                  create stories worth sharing.
                </p>
                <p className="mt-4 text-xl font-extralight text-neutral-900">
                  At Tramona, we are dedicated to making travel more accessible
                  and enjoyable, ensuring that every journey is memorable and
                  every stay is a perfect match.
                </p>
                <div className="absolute bottom-0 right-0 z-0 h-12 w-6 rotate-45 transform bg-white"></div>
                <p className="relative z-10 mt-4 text-right text-xl font-bold">
                  - Tramona Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SocialFeed;
