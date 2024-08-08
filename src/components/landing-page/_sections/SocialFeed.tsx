import React, { useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef } from "react";
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
    <div className="flex max-w-xs flex-col justify-between rounded-2xl">
      <div className="flex flex-grow flex-col justify-start p-4">
        <div className="mb-2 flex items-center">
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage
                src={userAvatar}
                alt="User avatar"
                className="rounded-full"
              />
              <AvatarFallback />
            </Avatar>
          </div>
          <div className="ml-4 flex flex-col justify-start">
            <div className="text-xs text-black md:text-sm">{username}</div>
            <div className="text-xs font-semibold text-black">{location}</div>
          </div>
        </div>
        <div className="relative h-72 w-72 flex-shrink-0 md:block md:h-72 md:w-72">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width:640px) 50vw, 100vw"
            className="rounded-2xl object-cover"
          />
        </div>
        <div>
          <p className="pt-2 text-xs text-neutral-900 md:text-sm">{caption}</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between rounded-b-2xl p-4">
        <div className="text-left text-black">
          <p className="text-lg font-semibold line-through">${originalPrice}</p>
          <p className="text-xs  tracking-tight">Airbnb price</p>
        </div>
        <div className="text-left text-black">
          <p className="text-lg font-semibold text-primary">${tramonaPrice}</p>
          <p className="text-xs tracking-tight">Our price</p>
        </div>
        <div className="bg-primary px-2 py-2 text-zinc-50">
          <p className="text-base font-semibold">
            {getDiscountPercentage(originalPrice, tramonaPrice)}% OFF
          </p>
        </div>
      </div>
    </div>
  );
};

const InfiniteScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetScrollPosition = (offset: number) => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += offset;
        }
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => resetScrollPosition(-scrollWidth / 2), 100);
        } else if (scrollLeft <= 0) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => resetScrollPosition(scrollWidth / 2), 100);
        }
      }
    };
    if (scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ overflowX: 'auto', width: '100vw' }}>
      <div ref={scrollRef} className="flex h-full overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {cardData.map((card, index) => (
            <SocialCard key={`pre-${index}`} {...card} />
          ))}
          {cardData.map((card, index) => (
            <SocialCard key={`original-${index}`} {...card} />
          ))}
          {cardData.map((card, index) => (
            <SocialCard key={`post-${index}`} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};


const SocialFeed: React.FC = () => {
  return (
    <>
      <section className="relative bg-white md:px-2 md:mx-12">
        <div className="mx-auto flex items-center justify-center p-5 sm:p-0 md:mt-2 lg:mt-2 2xl:mt-48">
          <div className="md:text-center md:mx-24 md:mb-12">
            <div className="md:px-4 py-2">
              <h2 className="mb-4 md:text-3xl text-2xl font-bold text-black">
                Make. <span className="font-bold italic">More.</span> Memories.
              </h2>
              <p className="block text-lg font-extralight text-neutral-900 md:hidden mb-4">
                See your friends, connect with amazing places and faces, create
                stories worth sharing.
              </p>
              <p className="block text-lg font-extralight text-neutral-900 md:hidden">
                At Tramona, we are dedicated to making
                travel more accessible and enjoyable, ensuring that every
                journey is memorable and every stay is a perfect match.
              </p>
              <p className="hidden text-lg font-extralight text-neutral-900 md:block">
                See your friends, connect with amazing places and faces, create
                stories worth sharing. At Tramona, we are dedicated to making
                travel more accessible and enjoyable, ensuring that every
                journey is memorable and every stay is a perfect match.
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 md:ml-2 md:mr-6 flex flex-col-reverse items-start justify-center text-white md:flex-row">
          <InfiniteScroll />
        </div>
      </section>
    </>
  );
};

export default SocialFeed;
