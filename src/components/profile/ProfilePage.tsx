import {
  Camera,
  Edit,
  Facebook,
  Instagram,
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

  return (
    <div className="mx-auto mb-3 max-w-4xl space-y-3">
      <div className="rounded-lg border">
        <div className="relative h-52 bg-teal-900">
          {/* <img
            src="https://t3.ftcdn.net/jpg/05/70/41/84/360_F_570418433_m1DoCjzGbZhDQKs96hMThzUz736s2zhl.jpg"
            alt=""
            className="w-full object-cover"
          />
          <p>image will go here</p> */}
          <Button className="absolute bottom-4 right-4 bg-primary/20">
            <Camera />
            Edit Cover Photo
          </Button>
        </div>
        <div className="relative grid grid-cols-4 bg-slate-100 px-6 py-8">
          <img
            src="https://images.ctfassets.net/rt5zmd3ipxai/25pHfG94sGlRALOqbRvSxl/9f591d8263607fdf923b962cbfcde2a9/NVA-panda.jpg"
            alt=""
            className="absolute bottom-3 left-10 h-40 w-40 rounded-full border border-white object-cover"
          />
          <div className="col-span-2 col-start-2 flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Aaron Soukaphay</h2>
            <p className="font-semibold">Tustin CA, USA</p>
            <div className="flex space-x-2">
              <Facebook />
              <Youtube />
              <Instagram />
              <Twitter />
            </div>
          </div>
          <div className="col-start-4 flex justify-end gap-3">
            <Button className="bg-zinc-200 text-primary hover:bg-zinc-300">
              <Edit />
              Edit Profile
            </Button>
            <Button className="bg-zinc-200 text-primary hover:bg-zinc-300">
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
        <h2 className="font-bold">Bucket List</h2>
        <Tabs defaultValue="properties" className="space-y-5">
          <TabsList className="items-center space-x-2">
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
            <Button>Add</Button>
            <Button>Share</Button>
          </TabsList>
          <TabsContent value="properties">
            <div className="grid grid-cols-3 gap-4">
              {properties.map((property, i) => (
                <HomeOfferCard key={i} property={property} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="destinations">
            <p>destinations content</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
