import MainLayout from "@/components/_common/Layout/MainLayout";
import Head from "next/head";
import { ReferralCodeForm } from "@/components/sign-up/ReferralCodeDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Referral() {
  const [open, setOpen] = useState(true);
  //When the use closes on the the dialog box, I want the state of the dialog box to be set to false and the dialog box to close.
  //Once the dialog box is closed, I want the url to redirect to the home page.
  const router = useRouter();
  if (!open) {
    router.push("/");
  }
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
