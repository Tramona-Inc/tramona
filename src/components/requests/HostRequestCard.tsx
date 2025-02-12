import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { ClockIcon } from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import UserAvatar from "../_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, MessageSquare, XCircle } from "lucide-react";
import { TramonaLogo } from "@/components/_common/Layout/header/TramonaLogo";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
export type HostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["request"];

export type HostPreviewRequest = RouterOutputs["requests"]["getByIdForPreview"];

export default function HostRequestCard({
  request,
}: {
  request: HostPreviewRequest;
}) {
  const router = useRouter();
  const session = useSession();
  const pricePerNight =
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  const handleUserClick = () => {
    if (session.data?.user) {
      const user = session.data.user;
      const isHost = user.role === "host";
      if (isHost) {
        void router.push("/host/requests");
      } else {
        console.log("hosting");
        void router.push("/host-onboarding");
      }
    } else {
      sessionStorage.setItem("requestPreviewSource", "true");
      void router.push("/auth/signup");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              size="md"
              name={request.traveler?.firstName}
              image={request.traveler?.image}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {request.traveler?.firstName}
                </span>
                <Badge className="bg-green-100 text-green-700">Verified</Badge>
              </div>
              <p className="text-xs text-gray-500">
                {formatDistanceToNowStrict(request.createdAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleUserClick}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message User
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleUserClick}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-4 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">{request.location}</h2>
          <div className="flex flex-row">
            <span className="text-gray-600 pr-4">Requested</span>
            <div
              className="mb-2 flex gap-1"
              style={{ alignItems: "baseline" }}
            >
              <span className="text-2xl font-bold">{fmtdPrice}</span>
              <span className="text-gray-600">/night</span>
            </div>
          </div>
           <div className="mt-2 flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>
              {fmtdDateRange} · {fmtdNumGuests}
            </span>
          </div>
        </div>
        
        <CardFooter className="mt-4">
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700"
            onClick={handleUserClick}
          >
            Accept the Booking
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-4 space-y-1 text-center">
        <div className="text-sm text-gray-500">with</div>
        {/* <div className="text-xl font-semibold tracking-tight">Tramona</div> */}
        <div className="flex justify-center pb-2">
          <TramonaLogo />
        </div>
        <div className="text-sm text-black">
          Book now for no fees on first 5 bookings
        </div>
      </div>
    </div>
  );
}
