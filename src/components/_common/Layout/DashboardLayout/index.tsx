import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { useIsMd } from "@/utils/utils";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { type Bid } from "@/server/db/schema/tables/bids";
import SuccessfulBidDialog from "@/components/offers/SuccessfulBidDialog";

type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "admin" | "host" | "guest" | "unlogged";
};

export default function DashboardLayout({
  children,
  type,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const isMd = useIsMd();

  const [open, setOpen] = useState(false);
  const [acceptedBid, setacceptedBid] = useState<Bid | null>(null);

  const { data: bids } = api.biddings.getMyBids.useQuery();
  const { mutateAsync: markDialogSeen } =
    api.biddings.putDialogShown.useMutation();

  useEffect(() => {
    if (bids) {
      const bid = bids.find((bid) => bid.status === "Accepted");
      if (bid && !bid.dialogShown) {
        setacceptedBid(bid);
        setOpen(true);
        void markDialogSeen({ bidId: bid.id });
      }
    }
  }, [bids, markDialogSeen]);

  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      {acceptedBid && (
        <SuccessfulBidDialog
          open={open}
          setOpen={setOpen}
          acceptedBid={acceptedBid}
        />
      )}
      <div className="relative min-h-screen-minus-header lg:flex">
        {session && (
          <aside className="sticky top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <div className="min-w-0 lg:flex-1">
          <main className="relative min-h-screen-minus-header">{children}</main>
          {session ? (
            <MobileNav type={type} />
          ) : (
            <MobileNav type={"unlogged"} />
          )}
          {isMd && <Footer />}
        </div>
      </div>
    </>
  );
}
