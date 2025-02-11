import MainLayout from "@/components/_common/Layout/MainLayout";
import Head from "next/head";
import { ReferralCodeForm } from "@/components/sign-up/ReferralCodeDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { useCohostInviteStore } from "@/utils/store/cohostInvite";

export default function Referral() {
  const [open, setOpen] = useState(true);
  //When the use closes on the the dialog box, I want the state of the dialog box to be set to false and the dialog box to close.
  //Once the dialog box is closed, I want the url to redirect to the home page.
  const { toast } = useToast();
  const router = useRouter();
  const [cohostInviteId] = useCohostInviteStore((state) => [
    state.cohostInviteId,
  ]);

  useEffect(() => {
    const requestPreviewSource = sessionStorage.getItem("requestPreviewSource");
    if (!open) {
      try {
        if (requestPreviewSource === "true") {
          console.log("hi");
          sessionStorage.removeItem("requestPreviewSource");
          void router.push("/host-onboarding");
        } else if (cohostInviteId) {
          console.log("cohostInviteId");
          void router.push(`/cohost-invite/${cohostInviteId}`);
        } else {
          void router.push("/");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: `An error occurred while redirecting to the home page`,
          variant: "destructive",
        });
      }
    }
  }, [cohostInviteId, open, router, toast]);
  return (
    <MainLayout>
      <Head>
        <title>Referral | Tramona</title>
      </Head>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <ReferralCodeForm />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
