import { cn } from "@/utils/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Reviews = {
  id: number;
  message: string;
  quote: string;
  profile_pic: string;
  fall_back: string;
  user_name: string;
  user_title: string;
};

const contents: Reviews[] = [
  {
    id: 1,
    message:
      "We work with thousands of hosts and property managers around the world.",
    quote:
      "Since joining Tramona, my property vacancies have significantly decreased – the platform & simple system to connect with travelers has kept my space consistently booked.",
    // profile_pic: "/assets/images/host-sign-up-props/user1.jpg",
    profile_pic: "",
    fall_back: "CK",
    user_name: "Craig Kenter",
    user_title: "Airbnb superhost, 3 properties",
  },

  {
    id: 2,
    message: "The First Tool Enabling Hosts to Proactively Book Their Rentals.",
    quote:
      "Actively searching for guests through Tramona has been a game-changer, allowing me to fill openings in my calendar for all of my properties.",
    profile_pic: "",
    fall_back: "CV",
    user_name: "Charlie Vetrovs",
    user_title: "Property manager, 13 properties",
  },
  {
    id: 3,
    message: "Make more revenue with Tramona",
    quote:
      "Tramona turned things around for me; during months when breaking even seemed challenging, the platform helped me secure additional bookings for my two properties, ensuring financial stability and peace of mind.",
    profile_pic: "",
    fall_back: "MV",
    user_name: "Marilyn Vetrovs",
    user_title: "Property manager, 47 properties",
  },
];

interface Props {
  newtab: number;
}

const Leftside: React.FC<Props> = ({ newtab }) => {
  const [tab, setTab] = useState<number>(1);

  useEffect(() => {
    setTab(newtab);
    // console.log(newtab + "LEFTSIDE");
  }, [newtab, tab]);

  return (
    <div className="flex flex-col items-center bg-[#4F46E5] text-white  lg:w-1/3 ">
      <div className="mb-5 mt-10 flex flex-col space-y-5 lg:mb-0 lg:mt-40">
        <div className=" px-5 text-center text-3xl font-bold xl:text-4xl">
          <h1>Hello 👋</h1>
          <h1>Welcome to Hosting!</h1>
        </div>
        <h3 className="text-center text-xl font-light">
          Let&apos;s get you setup.
        </h3>
      </div>

      <div className="hidden p-12 lg:block lg:p-10">
        <div className="relative pt-20 lg:pl-12 lg:pr-2 xl:pr-0">
          {contents.map((content) => (
            <div
              key={content.id}
              className={cn("space-y-10", content.id === tab ? "" : "hidden")}
            >
              <div className="space-y-8">
                <h1 className="text-xl font-bold">{content.message}</h1>
                <h2 className="font-semi-bold text-md italic 2xl:text-lg">
                  &ldquo;{content.quote}&rdquo;
                </h2>
              </div>

              <div className="flex flex-row space-x-3">
                {/* <Image
                    src={cn(
                      "text-2xl font-bold",
                      content.id === tab ? "" : "hidden",
                    )}
                    alt={""}
                    width={50}
                    height={50}
                    className="rounded-circle"
                  /> */}
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={content.profile_pic} alt="@shadcn" />
                    <AvatarFallback>{content.fall_back}</AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <h1 className="text-lg font-bold 2xl:text-xl">
                    {content.user_name}
                  </h1>

                  <h2 className="text-xs font-bold italic 2xl:text-lg">
                    {content.user_title}
                  </h2>
                </div>
              </div>
            </div>
          ))}

          <Image
            src="/assets/images/host-sign-up-props/star.png"
            width={75}
            height={75}
            alt={"Star"}
            className=" absolute top-0 flex items-center lg:-left-2 lg:top-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Leftside;
