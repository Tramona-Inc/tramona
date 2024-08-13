/* HostFinishRequestDialog.tsx */
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle
  } from "@/components/ui/dialog";
  import { Info } from "lucide-react";
  
  export default function HostICalHowToDialog() {
    return (
        <Dialog>
        <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
          <Info className="size-4" />
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-8">
          <DialogHeader>
            <DialogTitle className="mb-4 text-2xl font-bold">
              How to Sync Your Property&apos;s iCal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 1: Get Your Airbnb iCal Link
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Log in to your Airbnb account</li>
                <li>
                  Go to &quot;Manage Listings&quot; from your profile
                  menu
                </li>
                <li>Click on the &quot;Calendar&quot; tab</li>
                <li>Select the property you want to sync</li>
                <li>
                  On the right-hand side, navigate to
                  &quot;Availability&quot;
                </li>
                <li>
                  Scroll to &quot;Connect to another website&quot; and
                  copy the iCal link
                </li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 2: Enter the iCal Link on Our Website
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Log in to your host account on our website</li>
                <li>
                  Find &quot;Properties&quot; on the left-hand side
                </li>
                <li>
                  Navigate to your listing corresponding to the copied
                  iCal
                </li>
                <li>Paste the Airbnb iCal link</li>
                <li>Click &quot;Sync&quot;</li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 3: Verify the Sync
              </h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Wait a few minutes for synchronization</li>
                <li>
                  Check that Airbnb bookings appear on our
                  platform&apos;s calendar
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Tips for Smooth Syncing
              </h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Keep your iCal link handy for future updates</li>
                <li>Regularly check for booking conflicts</li>
              </ul>
            </section>

            <p className="text-sm text-muted-foreground">
              If you have any questions or issues, please contact our
              support team. Happy hosting!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  