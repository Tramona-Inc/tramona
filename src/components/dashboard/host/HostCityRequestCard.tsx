import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Property } from "@/server/db/schema";
import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";
import AcceptCityRequestDialog from "./AcceptCityRequestDialog";

export default function HostCityRequestCard({
  request,
  property,
}: {
  request: RouterOutputs["requests"]["getByPropertyId"][number];
  property: Pick<Property, "id">;
}) {
  const fmtdPrice = formatCurrency(request.maxTotalPrice);
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const fmtdPricePerNight = formatCurrency(request.maxTotalPrice / numNights);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  return (
    <>
      <AcceptCityRequestDialog
        request={request}
        property={property}
        open={acceptDialogOpen}
        setOpen={setAcceptDialogOpen}
      />
      <Card>
        {/* <div className="flex justify-between">
      <Badge variant="yellow">Pending</Badge>
      <RequestGroupAvatars isAdminDashboard request={request} />
    </div> */}
        <div className="flex items-end gap-4">
          <div>
            <div className="font-semibold">{fmtdPricePerNight}/night</div>
            <div className="text-muted-foreground">{fmtdPrice} total</div>
          </div>
          <div>
            <div className="font-semibold">{fmtdDateRange}</div>
            <div className="text-muted-foreground">
              {plural(numNights, "night")}
            </div>
          </div>
          <div>
            <div className="font-semibold">
              {plural(request.numGuests, "guest")}
            </div>
            <div className="text-muted-foreground">&nbsp;</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="ml-auto">
                Respond
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => setAcceptDialogOpen(true)}>
                <CheckIcon />
                Make an offer
              </DropdownMenuItem>
              <DropdownMenuItem red>
                <XIcon />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  );
}
