import {
  Camera,
  Edit,
  Ellipsis,
  Facebook,
  Instagram,
  Plus,
  Share,
  Twitter,
  Youtube,
} from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HomeOfferCard from "../landing-page/HomeOfferCard";

export default function ProfilePage() {
  const properties = [
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
    {
      id: 1,
      imageUrls: [
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/4fb2e4a4-35c8-4062-bc63-caf9d2b20147.jpg?im_w=720",
      ],
      name: "Beautiful Villa on the Beach",
      maxNumGuests: 4,
      numBathrooms: 2,
      numBedrooms: 2,
      numBeds: 2,
      originalNightlyPrice: 15000,
      distance: "24 miles",
    },
  ];

  const destinations = [
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
    {
      city: "New York City, NY, USA",
      date: "July 14-28",
    },
  ];

  return (
    <div className="mx-auto mb-5 max-w-4xl space-y-3">
      <div className="rounded-lg border">
        <div className="relative h-40 bg-teal-900 lg:h-52">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://t3.ftcdn.net/jpg/05/70/41/84/360_F_570418433_m1DoCjzGbZhDQKs96hMThzUz736s2zhl.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <Button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-primary/20 p-0 lg:w-auto lg:rounded-lg lg:px-3">
            <Camera />
            <p className="hidden lg:block">Edit Cover Photo</p>
          </Button>
        </div>
        <div className="relative grid grid-cols-1 gap-4 p-5 lg:grid-cols-4 lg:gap-0 lg:p-4">
          <img
            src="https://images.ctfassets.net/rt5zmd3ipxai/25pHfG94sGlRALOqbRvSxl/9f591d8263607fdf923b962cbfcde2a9/NVA-panda.jpg"
            alt=""
            className="absolute bottom-44 left-5 h-36 w-36 rounded-full border border-white object-cover lg:bottom-3 lg:left-10 lg:h-40 lg:w-40"
          />
          <Button
            size="icon"
            className="absolute left-32 top-2 rounded-full bg-primary/20 lg:hidden"
          >
            <Camera />
          </Button>
          <div></div>
          <div className="mt-7 flex flex-col gap-1 lg:col-span-2 lg:col-start-2 lg:mt-0">
            <h2 className="text-xl font-bold lg:text-2xl">Aaron Soukaphay</h2>
            <p className="font-semibold">Tustin CA, USA</p>
            <div className="flex space-x-2">
              <Facebook />
              <Youtube />
              <Instagram />
              <Twitter />
            </div>
          </div>
          <div className="flex gap-3 lg:col-start-4 lg:justify-end">
            <Button className="w-1/2 bg-zinc-200 text-primary hover:bg-zinc-300 lg:w-auto">
              <Edit />
              Edit Profile
            </Button>
            <Button className="w-1/2 bg-zinc-200 text-primary hover:bg-zinc-300 lg:w-auto">
              <Share />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <h2 className="font-bold">About Me</h2>
        <p>
          My name is Aaron. I am from Tustin, CA. I love traveling! I love
          traveling! I love traveling! I love traveling! I love traveling! I
          love traveling! I love traveling!
        </p>
      </div>

      <div className="space-y-5 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Bucket List</h2>
          <div className="lg:hidden">
            <Ellipsis />
          </div>
          <div className="hidden space-x-2 lg:block">
            <Button variant="ghost" className=" font-bold text-teal-900">
              <Plus />
              Add
            </Button>
            <Button variant="ghost" className="font-bold text-teal-900">
              <Share />
              Share
            </Button>
          </div>
        </div>
        <Tabs defaultValue="properties" className="space-y-5">
          <TabsList noBorder className="items-center space-x-2">
            <TabsTrigger
              value="properties"
              className="rounded-full border aria-[selected=true]:bg-teal-800/50"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="destinations"
              className="rounded-full border aria-[selected=true]:bg-teal-800/50"
            >
              Destinations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="properties">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {properties.map((property, i) => (
                <HomeOfferCard key={i} property={property} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="destinations">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {destinations.map((destination, i) => (
                <div
                  key={i}
                  className="flex justify-between rounded-lg border p-4"
                >
                  <div>
                    <h3 className="font-bold">{destination.city}</h3>
                    <p>{destination.date}</p>
                  </div>
                  <div>
                    <Ellipsis />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
