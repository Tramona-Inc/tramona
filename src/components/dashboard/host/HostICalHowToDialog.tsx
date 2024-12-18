/* HostFinishRequestDialog.tsx */
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

export default function HostICalHowToDialog() {
  return (
    <Dialog>
      <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
        <Info className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-8">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl font-bold">
            Syncing your calendar with Airbnb
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-lg font-semibold">
              Step 1: Get Your Airbnb iCal Link
            </h3>
            <ol className="list-inside list-decimal space-y-1">
              <li>Log in to your Airbnb account</li>
              <li>On the host side, click the calendar tab</li>
              <li>
                Make sure the correct property is selected and on the right side
                where it says &quot;Settings&quot;, click availability
              </li>
              <li>
                Scroll down to where it says &quot;Connect Calendars&quot;
              </li>
              <li>Click &quot;Connect to another website&quot;</li>
              <li>Copy the Airbnb URL and paste it in Tramona</li>
            </ol>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold">
              Step 2: Enter Tramona’s link on Airbnb
            </h3>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Copy the &quot;Tramona iCal URL&quot; and paste that link into
                Airbnb
              </li>
              <li>Give the Calendar a name</li>
              <li>
                Click &quot;Add Calendar&quot; on Airbnb and you are good to go
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
                Check that Airbnb bookings appear on our platform&apos;s
                calendar
              </li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground">
            If you have any questions or issues, please contact our support
            team. Happy hosting!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
