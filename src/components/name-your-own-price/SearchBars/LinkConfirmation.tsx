import { LINK_REQUEST_DISCOUNT_PERCENTAGE } from "@/utils/constants";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RequestSubmittedDialog from "./DesktopRequestComponents/RequestSubmittedDialog";
import { type LinkInputProperty } from "@/server/db/schema/tables/linkInputProperties";
import { type Request } from "@/server/db/schema";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import {
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  Users2Icon,
} from "lucide-react";
import { LinkInputPropertyCard } from "@/components/_common/LinkInputPropertyCard";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import SuperJSON from "superjson";

export interface LinkConfirmationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  property: LinkInputProperty;
  request: Pick<
    Request,
    "checkIn" | "checkOut" | "numGuests" | "location" | "maxTotalPrice"
  >;
  originalPrice: number;
}

const LinkConfirmation: React.FC<LinkConfirmationProps> = ({
  open,
  setOpen,
  property,
  request,
  originalPrice,
}) => {
  const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupId, setMadeByGroupId] = useState<number>();

  const { mutateAsync: createRequestWithLink, isLoading } =
    api.requests.createRequestWithLink.useMutation();

  const router = useRouter();
  const { status } = useSession();

  async function submitRequest() {
    if (status === "unauthenticated") {
      localStorage.setItem(
        "unsentLinkRequest",
        SuperJSON.stringify({ property, request }),
      );
      void router.push("/auth/signin").then(() => {
        toast({
          title: `Request and link saved: ${request.location}`,
          description: "It will be sent after you sign in",
        });
      });
    } else {
      await createRequestWithLink({ property, request })
        .then(({ madeByGroupId }) => {
          setMadeByGroupId(madeByGroupId);
          setOpen(false);
          setRequestSubmittedDialogOpen(true);
          setShowConfetti(true);
        })
        .catch((e) => {
          console.error(e);
          errorToast();
        });
    }
  }
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut, {
    withWeekday: true,
  });
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const fmtdOriginalNightlyPrice = formatCurrency(originalPrice / numNights);
  const fmtdNightlyPrice = (
    <span>
      <b>{formatCurrency(request.maxTotalPrice / numNights)}</b>
      <span className="text-xs">/night</span>
    </span>
  );
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="@container">
          <DialogHeader>
            <DialogTitle>Confirm your request details</DialogTitle>
          </DialogHeader>

          <div>
            <p className="pb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Linked property
            </p>

            <LinkInputPropertyCard property={property} />

            <p className="pb-1 pt-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Generated request
            </p>

            <div className="space-y-2 rounded-lg border p-2">
              {[
                { icon: MapPinIcon, content: request.location },
                {
                  icon: DollarSignIcon,
                  content: (
                    <div className="flex items-center gap-2">
                      <s className="text-muted-foreground">
                        {fmtdOriginalNightlyPrice}
                      </s>
                      {fmtdNightlyPrice}
                      <Badge size="sm">
                        -{LINK_REQUEST_DISCOUNT_PERCENTAGE}%
                      </Badge>
                    </div>
                  ),
                },
                { icon: CalendarIcon, content: fmtdDateRange },
                {
                  icon: Users2Icon,
                  content: plural(request.numGuests, "guest"),
                },
              ].map(({ icon: Icon, content }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="rounded-full bg-zinc-200 p-1.5">
                    <Icon className="size-4 text-zinc-600" />
                  </div>
                  <div className="text-sm font-medium">{content}</div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={submitRequest} disabled={isLoading}>
              Submit request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* 
      <RequestWaitlistDialog
        open={requestSubmittedDialogOpen}
        setOpen={setRequestSubmittedDialogOpen}
      /> */}

      <RequestSubmittedDialog
        open={requestSubmittedDialogOpen}
        setOpen={setRequestSubmittedDialogOpen}
        showConfetti={showConfetti}
        madeByGroupId={madeByGroupId}
      />
    </div>
  );
};

export default LinkConfirmation;
