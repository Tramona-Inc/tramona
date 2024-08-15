/* HostFinishRequestDialog.tsx */
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

interface HostICalHowToDialogProps {
  type: "airbnb" | "tramona";
}

export default function HostICalHowToDialog({
  type,
}: HostICalHowToDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
        <Info className="size-4" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-8">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-bold">
            {type === "airbnb"
              ? "Importing your Airbnb iCal to Tramona"
              : "Exporting your Tramona iCal to Airbnb"}
          </DialogTitle>
        </DialogHeader>
        {type === "airbnb" ? (
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 1: Get Your Airbnb iCal Link
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Log in to your Airbnb account</li>
                <li>
                  Go to &quot;Manage Listings&quot; from your profile menu
                </li>
                <li>Click on the &quot;Calendar&quot; tab</li>
                <li>Select the property you want to sync</li>
                <li>
                  On the right-hand side, navigate to &quot;Availability&quot;
                </li>
                <li>
                  Scroll to &quot;Connect to another website&quot; and copy the
                  iCal link
                </li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 2: Enter the iCal Link on Tramona
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Paste the Airbnb iCal link</li>
                <li>Click &quot;Submit&quot;</li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 3: Verify the Sync
              </h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Wait a few minutes for synchronization</li>
                <li>
                  Check that Airbnb bookings appear on our platform&apos;s
                  calendar
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
              If you have any questions or issues, please contact our support
              team. Happy hosting!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 1: Get your iCal Link on Tramona
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Copy your Tramona iCal URL</li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 2: Import your Tramona iCal Link on Airbnb
              </h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Log in to your Airbnb account</li>
                <li>
                  Go to &quot;Manage Listings&quot; from your profile menu
                </li>
                <li>Click on the &quot;Calendar&quot; tab</li>
                <li>Select the property you want to sync</li>
                <li>
                  On the right-hand side, navigate to &quot;Availability&quot;
                </li>
                <li>
                  Scroll to &quot;Connect to another website&quot; and, under &quot;Step 2&quot;, paste the Tramona iCal link and give the calendar a name
                </li>
                <li>
                  Click &quot;Add Calendar&quot;
                </li>
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Step 3: Verify the Sync
              </h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Wait a few minutes for synchronization</li>
                <li>
                  Check that your Tramona bookings appear on your Airbnb
                  calendar
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-2 text-lg font-semibold">
                Additional Tips
              </h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Airbnb refreshes dates from imported calendars every two hours</li>
                <li>Refreshes of imported calendars can be triggered manually</li>
                <li>Regularly check for booking conflicts</li>
              </ul>
            </section>

            <p className="text-sm text-muted-foreground">
              If you have any questions or issues, please contact our support
              team. Happy hosting!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
