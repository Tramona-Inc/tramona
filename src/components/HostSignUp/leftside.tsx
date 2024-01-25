import { cn } from "@/utils/utils";
import Image from "next/image";
import React, { useState } from "react";

type Reviews = {
  id: number;
  message: string;
  quote: string;
  profile_pic: string;
  user_name: string;
  user_title: string;
};

const contents: Reviews[] = [
  {
    id: 0,
    message:
      "We work with thousands of hosts and property managers around the world.",
    quote:
      "Since joining Tramona, my property vacancies have significantly decreased – the platform's simple system to connect with travelers has kept my space consistently booked.",
    profile_pic: "/assets/images/host-sign-up-props/user1.jpg",
    user_name: "Craig Kenter",
    user_title: "Airbnb superhost, 3 properties",
  },

  {
    id: 1,
    message: "The First Tool Enabling Hosts to Proactively Book Their Rentals.",
    quote:
      "Actively searching for guests through Tramona has been a game-changer, allowing me to fill openings in my calendar for all of my properties.",
    profile_pic: "",
    user_name: "Charlie Vetrovs",
    user_title: "Property manager, 13 properties",
  },
  {
    id: 2,
    message: "Make more revenue with Tramona",
    quote:
      "Tramona turned things around for me; during months when breaking even seemed challenging, the platform helped me secure additional bookings for my two properties, ensuring financial stability and peace of mind.",
    profile_pic: "",
    user_name: "Marilyn Vetrovs",
    user_title: "Property manager, 47 properties",
  },
];

export default function Leftside() {
  const [tab, setTab] = useState<number>(0);
  return (
    <div className="container flex h-full w-1/3 flex-col justify-center bg-[#4F46E5] text-white ">
      <div className="flex flex-col space-y-5 py-10 ">
        <div className=" text-center text-4xl font-bold">
          <h1>Hello 👋</h1>
          <h1>Welcome to Hosting</h1>
        </div>
        <h3 className="text-center text-xl font-light">Let's get you setup.</h3>
      </div>

      <div className="px-20">
        {contents.map((content) => (
          <div key={content.id} className="space-y-10">
            <div className="space-y-10">
              <h1
                className={cn(
                  "text-2xl font-bold",
                  content.id === tab ? "" : "hidden",
                )}
              >
                {content.message}
              </h1>

              <h2
                className={cn(
                  "text-lg font-bold italic",
                  content.id === tab ? "" : "hidden",
                )}
              >
                "{content.quote}"
              </h2>
            </div>

            <div className="flex flex-row">
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
              <div>
                <h1
                  className={cn(
                    "text-2xl font-bold",
                    content.id === tab ? "" : "hidden",
                  )}
                >
                  {content.user_name}
                </h1>

                <h2
                  className={cn(
                    "text-xl font-bold italic",
                    content.id === tab ? "" : "hidden",
                  )}
                >
                  "{content.user_title}"
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
