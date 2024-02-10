import UpcomingCard from "@/components/my-trips/upcoming-card";

// function UpcomingCard() {
//     return (

//     )
// }

// function PreviousCard() {} {
//     return (

//     )
// }

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
          <div className="border-2xl rounded-lg border shadow-xl">
            <img
              src="/assets/images/fake-properties/3.png"
              alt=""
              className="h-[250px] w-full rounded-t-lg"
            />
            <p className="p-2 text-sm font-bold">
              Private Cozy Clean, close to EVERYTHING <br />
              Nov 6 - 11, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
