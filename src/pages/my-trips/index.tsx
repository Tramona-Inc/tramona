import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import PastTrips from "@/components/my-trips/PastTrips";

// export default function MyTrips() {
//   const date = useMemo(() => new Date(), []); // useMemo from React

//   const { data, isLoading } = api.myTrips.mostRecentTrips.useQuery({
//     date: date,
//   });

//   let total = 0;

//   if (data) {
//     total = data.totalPreviousTrips + data.totalUpcomingTrips;
//   }

//   return (
//     <DashboardLayout type="guest">
//       <Head>
//         <title>My Trips | Tramona</title>
//       </Head>

//       <div className="container col-span-10 flex min-h-screen-minus-header flex-col gap-10 py-10 2xl:col-span-11">
//         <h1 className="text-4xl font-bold">My Trips</h1>

//         {total > 0 ? (
//           <div className="flex w-full flex-col gap-10 lg:flex-row">
//             <div className="flex flex-col gap-8 lg:w-2/3">
//               <div className="flex items-center justify-between">
//                 <div className="flex flex-row items-center">
//                   <h1 className="text-2xl font-bold">Upcoming</h1>
//                   {!isLoading && (
//                     <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
//                       {data?.totalUpcomingTrips}
//                     </span>
//                   )}
//                 </div>

//                 {data?.displayUpcomingTrips !== null && !isLoading && (
//                   <Button variant={"darkPrimary"} asChild>
//                     <Link href={"/my-trips/upcoming"}>View More ...</Link>
//                   </Button>
//                 )}
//               </div>
//               {isLoading ? (
//                 <Spinner />
//               ) : (
//                 <>
//                   {data?.displayUpcomingTrips ? (
//                     data?.displayUpcomingTrips.map((trip: UpcomingTrip) => {
//                       return (
//                         <UpcomingCard
//                           key={trip.id}
//                           name={trip.property.name}
//                           offerId={trip.id}
//                           hostName={trip.property.host?.name ?? ""}
//                           hostImage={trip.property.host?.image ?? ""}
//                           date={formatDateRange(
//                             trip.request.checkIn,
//                             trip.request.checkOut,
//                           )}
//                           address={trip.property.address ?? ""}
//                           propertyImage={trip.property.imageUrls[0] ?? ""}
//                           checkInInfo={trip.property.checkInInfo ?? ""}
//                         />
//                       );
//                     })
//                   ) : (
//                     <div className="flex h-full flex-col items-center justify-center gap-5">
//                       <h1 className="text-2xl font-bold">No upcoming trips</h1>
//                       <Button variant={"darkOutline"} asChild>
//                         <Link href={"/requests"}>Book some trips!</Link>
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             <div className="flex flex-col gap-8 lg:w-1/3">
//               <div className="flex items-center justify-between">
//                 <div className="flex flex-row items-center">
//                   <h1 className="text-2xl font-bold">Previous</h1>
//                   {!isLoading && (
//                     <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
//                       {data?.totalPreviousTrips}
//                     </span>
//                   )}
//                 </div>

//                 {data?.displayPreviousTrips !== null && !isLoading && (
//                   <Button variant={"darkPrimary"} asChild>
//                     <Link href={"/my-trips/previous"}>View More ...</Link>
//                   </Button>
//                 )}
//               </div>
//               <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
//                 {isLoading ? (
//                   <Spinner />
//                 ) : (
//                   <>
//                     {data?.displayPreviousTrips ? (
//                       data?.displayPreviousTrips.map((trip: PreviousTrip) => {
//                         return (
//                           <PreviousCard
//                             key={trip.id}
//                             name={trip.property.name}
//                             date={formatDateRange(
//                               trip.request.checkIn,
//                               trip.request.checkOut,
//                             )}
//                             image={trip.property.imageUrls[0] ?? ""}
//                             offerId={trip.id}
//                           />
//                         );
//                       })
//                     ) : (
//                       <div className="flex h-full flex-col items-center justify-center gap-5">
//                         <h1 className="text-2xl font-bold">
//                           No previous trips
//                         </h1>
//                         <Button variant={"darkOutline"} asChild>
//                           <Link href={"/requests"}>Book some trips!</Link>
//                         </Button>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <EmptyStateValue
//             title={"You have no upcoming trips"}
//             description={
//               "once you've booked a property your trips will show up here."
//             }
//             redirectTitle={"Start Searching"}
//             href={"/"}
//           >
//             <MyTripsEmptySvg />
//           </EmptyStateValue>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

export default function MyTrips() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data: trips, isLoading: loadingTrips } =
    api.myTrips.getUpcomingTrips.useQuery({ date });
  const { data: pastTrips, isLoading: loadingPastTrips } =
    api.myTrips.getPreviousTrips.useQuery({ date });

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      <div className="container col-span-10 flex min-h-screen-minus-header flex-col gap-10 py-10 2xl:col-span-11">
        <h1 className="text-4xl font-bold">My Trips</h1>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger
              value="upcoming"
              className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
            >
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-3 pt-8 md:gap-5 lg:gap-8">
              <UpcomingTrips trips={trips} isLoading={loadingTrips} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="grid grid-cols-1 gap-3 pt-8 md:gap-5 lg:gap-8 xl:grid-cols-2">
              <PastTrips pastTrips={pastTrips} isLoading={loadingPastTrips} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
