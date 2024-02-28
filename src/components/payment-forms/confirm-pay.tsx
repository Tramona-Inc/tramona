import { X, Copy, MessageCircle, AlertTriangle } from "lucide-react";
import { render } from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
function BookingInstructionsDialog() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Booking Instructions</Button>
      </DialogTrigger>
      <DialogContent className="w-[350px] space-y-4 p-4">
        <DialogHeader className="flex justify-between">
          <DialogTitle>Booking instructions</DialogTitle>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold">Step 1</h4>
          <h5 className="font-semibold">Pay the Tramona fee</h5>
          <p>Non Tramona Price: $1000</p>
          <p>Tramona Price: $900</p>
          <p>Total savings with Tramona: $100</p>
          <p>Tramona Fee: $20 (we charge a 20% fee of your total savings).</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogDescription>
                Paying the Tramona fee does not guarantee a successful booking.
                If you fail, we will refund you.
              </AlertDialogDescription>
              <AlertDialogAction onClick={() => setIsAlertDialogOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p>Price details</p>
              <p>Tramona Fee</p>
              <p>Total</p>
            </div>
            <div>
              <p>$20</p>
              <p>$20</p>
            </div>
          </div>
          <Button>Pay now</Button>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold">Step 2</h4>
          <h5 className="font-semibold">Airbnb link gets unlocked</h5>
          <Input
            placeholder="https://www.airbnb.com/rooms/xxxxxxxx"
            className="border-dashed"
          />
          <Button>
            <Copy className="mr-2 h-4 w-4" /> Copy link
          </Button>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold">Step 3</h4>
          <h5 className="font-semibold">
            Contact the host through the chat feature on Airbnb by copy and
            pasting our premade message
          </h5>
          <Button>
            <Copy className="mr-2 h-4 w-4" /> Copy message
          </Button>
          <Button>
            <MessageCircle className="mr-2 h-4 w-4" /> Contact host
          </Button>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold">Step 4</h4>
          <h5 className="font-semibold">
            Receive exclusive offer from the host
          </h5>
          <p>They will accept or deny, through the chat.</p>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold">Step 5</h4>
          <h5 className="font-semibold">Book Stay</h5>
          <p>You're done!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default BookingInstructionsDialog;
// render(<BookingInstructionsDialog />, document.getElementById("root"));
