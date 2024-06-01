import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export default function SuccessfulOffer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold">You&apos;re Goin&apos;</h1>
          <div className="relative overflow-clip rounded-2xl">
            <div className="h-96 w-96">
              <Image
                src="https://a0.muscache.com/im/pictures/miso/Hosting-51484349/original/d1be29ea-f986-48b7-afa1-e3728de75a87.jpeg?im_w=720"
                alt=""
                fill
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center bg-zinc-300 text-center">
              <p className="font-bold text-teal-900">
                You saved 55% on this stay
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold">
            Congrats on placing the winning offer!
          </h3>
          <p>Your trip to Paris from June 22nd - June 28th is confirmed</p>
          <Button variant="greenPrimary" className="px-10">
            My Trips
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
