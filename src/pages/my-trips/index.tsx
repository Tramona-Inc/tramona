import PreviousCard from "@/components/my-trips/PreviousCard";
import UpcomingCard from "@/components/my-trips/UpcomingCard";

export default function MyTrips() {
  return (
    <div className="px-6 py-10 sm:px-16">
      <h1 className="text-4xl font-bold">My Trips</h1>
      <div className="grid grid-cols-1 py-8 lg:grid-cols-3 lg:gap-8">
        <div className="col-span-2 flex flex-col gap-8">
          <p className="text-2xl font-bold">Upcoming</p>

          <UpcomingCard />
        </div>

        <div className="col-span-1">
          <p className="mt-8 text-2xl font-bold lg:mt-0">Previous</p>
          <PreviousCard />
        </div>
      </div>
    </div>
  );
}
