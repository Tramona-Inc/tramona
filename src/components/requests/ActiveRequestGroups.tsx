import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import SimiliarProperties from "./SimilarProperties";
import { useState } from "react";
import { type DetailedRequest } from "@/components/requests/RequestCard";
import { useMediaQuery } from "../_utils/useMediaQuery";
import { Button } from "@/components/ui/button";
import { DesktopRequestDealTab } from "../landing-page/SearchBars/DesktopRequestDealTab";
import { MobileRequestDealTab } from "../landing-page/SearchBars/MobileRequestDealTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
export default function ActiveRequestGroups() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [open, setOpen] = useState(false);

  const { data: requests } = api.requests.getMyRequests.useQuery();
  //you can access all of the request details with selectedRequest
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <div>
      {isMobile && (
        <p className="my-5 flex w-11/12 px-4 text-sm md:hidden">
          {" "}
          Submit bids while waiting for your request to increase your chance of
          getting a great deal.
        </p>
      )}
      <div className="grid grid-cols-2 gap-24">
        <div className="col-span-1">
          {isMobile ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mb-4 rounded-md pr-3" variant="secondary">
                  + Create new city offer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="border-b pb-2 font-bold">
                  Request a deal
                </DialogHeader>
                <MobileRequestDealTab closeSheet={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mb-4 rounded-md pr-3" variant="secondary">
                  + Create new city offer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <DialogHeader className="border-b pb-2 font-bold">
                  Request a deal
                </DialogHeader>
                <DesktopRequestDealTab />
              </DialogContent>
            </Dialog>
          )}
          <RequestCards
            requestGroups={requests.activeRequestGroups}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
          />
        </div>
        <div className="col-span-1">
          {selectedRequest?.location ? (
            !isMobile && (
              <SimiliarProperties
                location={selectedRequest.location}
                city={selectedRequest.location}
              />
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  ) : (
    <EmptyStateValue
      title={"No city requests"}
      description={
        "You don't have any active requests. Requests that you submit will show up here."
      }
      redirectTitle={"Request Deal"}
      href={"/"}
    >
      <RequestEmptySvg />
    </EmptyStateValue>
  );
}
