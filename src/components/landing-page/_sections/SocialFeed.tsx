import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import  { useEffect, useState, useRef } from 'react';
import { getDiscountPercentage } from "@/utils/utils";

interface SocialCardProps {
  image: string;
  username: string;
  caption: string;
  location: string;
  userAvatar: string;
  originalPrice: number;
  tramonaPrice:number; 
}

const SocialCard: React.FC<SocialCardProps> = ({
  image,
  username,
  caption,
  location,
  userAvatar,
  originalPrice,
  tramonaPrice
}) => {
  return (
    <div className="mb-1 flex flex-col items-start overflow-hidden rounded-2xl border border-[#BFBFBF] bg-gray-400 bg-opacity-10 bg-clip-padding shadow-lg backdrop-blur-xl backdrop-filter">
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
              <div className="text-xs text-gray-500">{location}</div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-800 md:text-sm">{caption}</p>
          </div>
        </div>
        <div className="relative h-36 w-36 flex-shrink-0 md:block hidden md:h-48 md:w-48 lg:h-48 lg:w-48">
          <Image
            src={image}
            alt={caption}
            fill
            className="rounded-2xl object-cover p-2"
          />
        </div>
      </div>
      <div className="mb-2 mt-0 flex w-full items-center bg-white bg-opacity-50 justify-between">
        <div className="text-center text-secondary-foreground/50 md:mx-6 mx-2">
          <p className="text-lg md:text-xl font-semibold line-through lg:text-3xl">
            ${originalPrice}
          </p>
          <p className="text-xs md:text-sm tracking-tight">Airbnb price</p>
        </div>
        <div className="text-center text-secondary-foreground/50">
          <p className="text-lg md:text-xl font-semibold text-primary lg:text-3xl">
            ${tramonaPrice}
          </p>
          <p className="text-xs md:text-sm tracking-tight">Our price</p>
        </div>
        <div className="md:mx-6 mx-2 bg-primary  px-2 py-2 text-zinc-50 lg:px-5 lg:py-3">
          <p className="text-base md:text-lg font-semibold lg:text-xl">
            {getDiscountPercentage(originalPrice, tramonaPrice)}% OFF
          </p>
        </div>
      </div>
    </div>
  );
};


const cardData = [
  {
    image: '/assets/images/landing-page/nashville.jpeg',
    username: 'jon_f',
    caption: '',
    location: 'Nashville, TN',
    userAvatar: '/assets/images/landing-page/us_1.jpeg',
    originalPrice: 900, 
    tramonaPrice: 450, 
  },
  {
    image: '/assets/images/landing-page/post3.jpeg',
    username: 'gdebra',
    caption: "California's hidden gem. 🍇🌅 ",
    location: 'Paso Robles, CA',
    userAvatar: '/assets/images/landing-page/us_3.jpeg',
    originalPrice: 195, 
    tramonaPrice: 175, 
  },
  {
    image: '/assets/images/landing-page/post2.jpeg',
    username: 'angel_f',
    caption: '',
    location: 'Vail, CO',
    userAvatar: '/assets/images/landing-page/us_2.jpeg',
    originalPrice: 454, 
    tramonaPrice: 400, 
  },
  {
    image: '/assets/images/landing-page/post1.jpeg',
    username: 'partha',
    caption: 'Beautiful sunset at the beach!',
    location: 'Del Mar, CA',
    userAvatar: '/assets/images/landing-page/us_1.jpeg',
    originalPrice: 475, 
    tramonaPrice: 375, 
  },
  {
    image: '/assets/images/landing-page/post2.jpeg',
    username: 'dylan_s',
    caption: '',
    location: 'Sayulita, Mexico',
    userAvatar: '/assets/images/landing-page/us_2.jpeg',
    originalPrice: 377, 
    tramonaPrice: 175, 
  },
  {
    image: '/assets/images/landing-page/post3.jpeg',
    username: 'karl',
    caption: '',
    location: 'Iceland',
    userAvatar: '/assets/images/landing-page/us_3.jpeg',
    originalPrice: 390, 
    tramonaPrice: 276, 
  },
  {
    image: '/assets/images/landing-page/newyork.jpeg',
    username: 'abhay',
    caption: 'Exploring that urban jungle 🏙️ ',
    location: 'New York, NY',
    userAvatar: '/assets/images/landing-page/us_3.jpeg',
    originalPrice: 163, 
    tramonaPrice: 132, 
  },
];

const InfiniteScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const surroundingBackup = 2; 
  const cardHeightPx = 200; 

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
      container.scrollTop = contentHeight * surroundingBackup; 
    }
  }, [surroundingBackup]); 

  return (
    <div
      ref={scrollRef}
      className="overflow-auto h-[calc(100vh-2rem)] scrollbar-hide"
      onScroll={handleScroll}
    >
      {Array.from({ length: surroundingBackup }, (_, i) =>
        cardData.map((card, index) => <SocialCard key={`pre-${i}-${index}`} {...card} />)
      )}
      <div ref={contentRef}>
        {cardData.map((card, index) => <SocialCard key={`original-${index}`} {...card} />)}
      </div>
      {Array.from({ length: surroundingBackup }, (_, i) =>
        cardData.map((card, index) => <SocialCard key={`post-${i}-${index}`} {...card} />)
      )}
    </div>
  );
};

const SocialFeed: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative bg-gray-100 p-2 md:px-2">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/landing-page/social_feed.png"
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          className="rounded-3xl p-2 md:px-2"
        />
      </div>
      <div className="relative z-10 flex flex-col-reverse items-start justify-center rounded-3xl p-8 text-white md:flex-row">
        <div className="w-full md:max-w-md md:flex-1">
          <InfiniteScroll/>
        </div>
        <div className="mb-4 w-full md:mb-0 md:max-w-lg md:flex-1 md:pl-16 lg:pl-28">
          <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Make more memories
          </h2>
          <p className="text-2xl font-extralight text-black md:mt-24">
            Our only goal is to enable you to travel more often.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
