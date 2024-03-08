import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SocialCardProps {
  image: string;
  username: string;
  caption: string;
  location: string;
  userAvatar: string;
}

const SocialCard: React.FC<SocialCardProps> = ({
  image,
  username,
  caption,
  location,
  userAvatar,
}) => {
  return (
    <div className="mb-1 flex items-start overflow-hidden rounded-2xl border border-[#BFBFBF] bg-gray-400 bg-opacity-10 bg-clip-padding shadow-lg backdrop-blur-sm backdrop-filter">
      <div className="flex flex-grow flex-col justify-start p-4">
        <div className="mb-2 flex items-center">
          <div className="flex-shrink-0">
            {userAvatar ? (
              <Avatar>
                <AvatarImage src={userAvatar} style={{ objectFit: "cover" }} />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-300 md:h-12 md:w-12"></div>
            )}
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
      <div className="relative h-24 w-24 flex-shrink-0 md:h-48 md:w-48">
        <Image
          src={image}
          alt={caption}
          fill
          className="rounded-2xl object-cover p-2"
        />
      </div>
    </div>
  );
};

const SocialFeed = () => {
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
      <div className="relative z-10 flex flex-col-reverse items-start justify-center rounded-3xl  p-8 text-white shadow md:flex-row">
        <div className="w-full md:max-w-md md:flex-1">
          <SocialCard
            image="/assets/images/landing-page/post1.jpeg"
            username="anonymous"
            caption=""
            location="Santa Cruz, CA"
            userAvatar="/assets/images/landing-page/us_1.jpeg"
          />
          <SocialCard
            image="/assets/images/landing-page/post2.jpeg"
            username="nickshawl"
            caption="Loving the beach!"
            location="Santa Monica, CA"
            userAvatar="/assets/images/landing-page/us_2.jpeg"
          />
          <SocialCard
            image="/assets/images/landing-page/post3.jpeg"
            username="yamsnicole"
            caption=""
            location="Oregon Coast"
            userAvatar="/assets/images/landing-page/us_3.jpeg"
          />
        </div>
        <div className="mb-4 w-full md:mb-0 md:max-w-lg md:flex-1 md:pl-16 lg:pl-28">
          <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Live more, travel more.
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
