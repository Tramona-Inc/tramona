import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MapPin from "../_icons/MapPin";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type CityRequestCardProps = {
  requestId: string;
  location: string;
  offerNightlyPrice: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
  status: string;
  propertyName?: string;
  propertyImage: string;
};

function CityRequestCards(props: CityRequestCardProps) {
  return (
    <div className="border-2xl flex flex-row rounded-lg border shadow-xl md:flex-row">
      <Link
        href={`/offers/${props.requestId}`}
        className="relative flex items-center justify-center max-md:ml-5 md:h-[200px] md:w-1/3"
      >
        <Badge className="xs:top-5 absolute left-2 top-7 z-40 bg-white text-[#4D535F] md:left-2 md:top-2">
          {props.status}
        </Badge>
        <Image
          alt={props.propertyImage}
          className="max-md absolute hidden rounded-lg md:block md:rounded-r-none"
          src={props.propertyImage}
          fill
          objectFit="cover"
        />
        <Image
          alt={props.propertyImage}
          className="aspect-square rounded-md object-cover"
          src={props.propertyImage}
          height={200}
          width={200}
        />
      </Link>
      <div className="flex w-full flex-col space-y-3 p-5">
        <div className="flex flex-row justify-between">
          <h1 className="flex flex-row items-center font-bold md:text-xl">
            <MapPin />
            {props.location}
          </h1>

          <EllipsisIcon className="mr-2" />
        </div>
        <p>Requested: ${props.offerNightlyPrice}/night</p>
        <p>Date - Date</p>

        <div className="flex flex-row justify-between">
          <p>{props.guests} Guests</p>

          <div className="hidden flex-row font-semibold md:block">
            <Button variant={"secondary"} className="font-semibold">
              Resend Confirmation
            </Button>
            <Button variant={"underline"} className="font-semibold">
              Update request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActiveRequestGroups() {
  // const { data: requests } = api.requests.getMyRequests.useQuery();

  // if (!requests) return <Spinner />;

  const data: CityRequestCardProps = {
    requestId: "1",
    location: "Los Angeles, CA, USA",
    offerNightlyPrice: "100",
    checkIn: new Date(),
    checkOut: new Date(),
    guests: "4",
    status: "Unconfirmed",
    propertyImage: "/assets/images/house.jpg",
  };

  return (
    <div>
      <CityRequestCards {...data} />
    </div>
  );

  // return requests.activeRequestGroups.length !== 0 ? (
  //   <RequestCards requestGroups={requests.activeRequestGroups} />
  // ) : (
  //   <EmptyStateValue
  //     title={"You have no city requests"}
  //     description={
  //       "You don't have any active requests. Requests that you submit will show up here."
  //     }
  //     redirectTitle={"Request Deal"}
  //     href={"/"}
  //   >
  //     <RequestEmptySvg />
  //   </EmptyStateValue>
  // );
}
