import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function UnclaimedOfferCard() {
  return (
    <div className="grid grid-cols-10 items-center rounded-xl border pr-8 text-center">
      <Image
        src="https://a0.muscache.com/im/pictures/miso/Hosting-1079805555469793287/original/16c19ebc-c53b-4fdc-a9aa-05323c500358.jpeg?im_w=1200"
        alt=""
        width={150}
        height={130}
        className=" col-span-1 rounded-l-xl"
      />
      <div className="col-span-1 flex items-center justify-center font-bold">
        Houston
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        $100
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        $80
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        Jun 1 - Jun 4
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        2 pers.
      </div>
      <div className="col-span-1 flex items-center justify-center font-semibold">
        2
      </div>
      <Button variant="ghost" size="lg" className="col-span-1 font-semibold">
        Share
      </Button>
      <div className="col-span-1 flex items-center justify-center">
        <Link
          href="/requests"
          className="font-semibold text-teal-800 underline underline-offset-4"
        >
          {" "}
          Property Info{" "}
        </Link>
      </div>
      <Button variant="greenPrimary" className="ont-semibold col-span-1">
        Book
      </Button>
    </div>
  );
}
