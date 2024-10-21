import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";

type RequestToBookBtnProps = {
  propertyId: number;
  maxNumGuests: number;
};

export function RequestToBookBtn({ propertyId, maxNumGuests }: RequestToBookBtnProps) {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numGuests, setNumGuests] = useState(1);

  const createRequestMutation = api.requestsToBook.create.useMutation();

  const handleRequestToBook = () => {
    createRequestMutation.mutate({
      propertyId,
      madeByGroupId: 1, // You'll need to replace this with the actual group ID
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      numGuests,
    }, {
      onSuccess: () => {
        setIsRequestDialogOpen(false);
        // You might want to show a success message or redirect the user
      },
      onError: (error) => {
        console.error("Failed to create request:", error);
        // You might want to show an error message to the user
      }
    });
  };

  return (
    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
      <DialogTrigger asChild>
        <Button>Request To Book</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Book</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="checkIn" className="text-right">
              Check-in
            </Label>
            <Input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="checkOut" className="text-right">
              Check-out
            </Label>
            <Input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="numGuests" className="text-right">
              Guests
            </Label>
            <Input
              id="numGuests"
              type="number"
              value={numGuests}
              onChange={(e) => setNumGuests(parseInt(e.target.value))}
              min={1}
              max={maxNumGuests}
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleRequestToBook} disabled={createRequestMutation.isLoading}>
          {createRequestMutation.isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}