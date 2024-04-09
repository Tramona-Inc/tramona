import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Container } from "@react-email/components";
import { Home } from "lucide-react";
import Image from "next/image";

const amenities = [
  "amenity",
  "amenity",
  "amenity",
  "amenity",
  "amenity",
  "amenity",
];

export default function onboarding10() {
  return (
    <MainLayout>
      <Container className="my-10">
        <h1 className="mb-8 text-3xl font-semibold">Review your listing</h1>
        <div className="mb-10 flex rounded-lg border-2">
          <div className="grid grid-cols-1 divide-y p-4">
            <div>
              <h2 className="text-xl font-bold">Seattle, WA, USA</h2>
              <p className="text-sm text-zinc-500">Hosted by Christopher</p>
            </div>
            <div className="flex flex-col justify-center space-y-2 text-sm">
              <div className="flex items-center">
                <Home className="me-2" />
                <p className="text-zinc-500">Apartment</p>
              </div>
              <div className="flex">
                <Home className="me-2" />
                <p className="text-zinc-500">
                  5 guests, 1 bedroom, 2 beds, 1 bathroom
                </p>
              </div>
            </div>
          </div>
          <div className="relative basis-1/2">
            <img
              src="https://dcist.com/wp-content/uploads/sites/3/2023/01/51256044458_3a9abb45e5_k.jpg"
              className="rounded-r-md"
            />
            <div className="absolute right-2 top-2">
              <Button className="bg-zinc-300/75 text-primary">Preview</Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 space-y-3 divide-y">
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Type of Property</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="flex">
              <Home className="me-2" />
              <p className="text-zinc-500">Apartment</p>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Living Situation</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="flex">
              <Home className="me-2" />
              <div className="text-zinc-500">
                <p>A shared room</p>
                <p>5 guests, 1 bedroom, 2 beds, 1 bathroom</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="flex">
              <Home className="me-2" />
              <div className="text-zinc-500">
                <p>6859 Main St</p>
                <p>Bellevue, WA, USA</p>
              </div>
            </div>
            <img
              src="https://media.nbclosangeles.com/2023/04/redpandasbzoo.jpg?quality=85&strip=all&fit=1280%2C720"
              className="rounded-lg border"
            />
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Check-in</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="text-zinc-500">
              <p>Self check-in / out</p>
              <p>Check-in: 11:00 AM - Check-out: 11:00 PM</p>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Amenities</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div>
              <div className="flex flex-col flex-wrap space-y-3">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex">
                    <Home className="me-2" />
                    <p>{amenity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Photos</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="grid h-[420.69px] grid-cols-4 grid-rows-2 gap-2 overflow-clip rounded-xl">
              <div className="relative col-span-2 row-span-2 bg-accent">
                <Image
                  src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-689337770931210679/original/4e454dc9-30af-4786-9ea5-ded22c8dc9cd.jpeg?im_w=1200"
                  alt=""
                  fill
                  objectFit="cover"
                  priority
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-689337770931210679/original/4e454dc9-30af-4786-9ea5-ded22c8dc9cd.jpeg?im_w=1200"
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-689337770931210679/original/4e454dc9-30af-4786-9ea5-ded22c8dc9cd.jpeg?im_w=1200"
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-689337770931210679/original/4e454dc9-30af-4786-9ea5-ded22c8dc9cd.jpeg?im_w=1200"
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="relative col-span-1 row-span-1 bg-accent">
                <Image
                  src="https://a0.muscache.com/im/pictures/prohost-api/Hosting-689337770931210679/original/4e454dc9-30af-4786-9ea5-ded22c8dc9cd.jpeg?im_w=1200"
                  alt=""
                  fill
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div>
              <p className="font-semibold">Title</p>
              <p className="text-zinc-500">Island Luxury Oceanside Estate</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-zinc-500">
                Welcome to our Island Luxury Oceanside Estate! Nestled on a
                secluded island, this retreat offers lush gardens, a sparkling
                infinity pool, and a private sandy beach just steps away.
                Inside, discover elegantly designed living spaces, gourmet
                kitchen, and sumptuous bedrooms with breathtaking ocean views.
              </p>
            </div>
          </div>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">House Rules</h3>
              <p className="text-sm underline">Edit</p>
            </div>
            <div className="flex">
              <Home className="me-2" />
              <p className="text-zinc-500">No pets</p>
            </div>
            <div className="flex">
              <Home className="me-2" />
              <p className="text-zinc-500">No smoking</p>
            </div>
            <div>
              <p className="font-semibold">Additional rules</p>
              <p className="text-zinc-500">
                Keep noise levels to a minimum, especially during quiet hours
                from 10PM to 10AM
              </p>
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
