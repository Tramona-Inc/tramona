import PreviousCard from "@/components/my-trips/PreviousCard";
import UpcomingCard from "@/components/my-trips/UpcomingCard";
import { api } from "@/utils/api";

const offer = {
  name: "Tropical getaway in Mexico",
  hostName: "Kaiya Culhane",
  hostImage: "",
  date: "Nov 6 - 11, 2024",
  address: "6243 Sand crest Circle Orlando, Florida United States",
  propertyImage: "/assets/images/fake-properties/3.png",
};

const previous = {
  name: "Private Cozy Clean, close to EVERYTHING",
  date: "Nov 6 - 11, 2024",
  image: "/assets/images/fake-properties/1.png",
};

export default function MyTrips() {
  const { data } = api.myTrips.mostRecentTrips.useQuery();

  console.log(data);

  return (
    <div className="container flex flex-col gap-10 py-10">
      <h1 className="text-4xl font-bold">My Trips</h1>

      <div className="flex w-full flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-8 lg:w-2/3">
          <h2 className="text-2xl font-bold">Upcoming</h2>

          <UpcomingCard {...offer} />
          <UpcomingCard {...offer} />
        </div>

        <div className="flex flex-col gap-8 lg:w-1/3">
          <h2 className="text-2xl font-bold ">Previous</h2>
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
            <PreviousCard {...previous} />
            <PreviousCard {...previous} />
          </div>
        </div>
      </div>
    </div>
  );
}
