import Image from "next/image";

type PreviousCardProps = {
  image: string;
  name: string;
  checkIn: string;
  checkOut: string;
};

export default function PreviousCard( props: PreviousCardProps ) {
  return (
    <div className="border-2xl rounded-lg border shadow-xl">
      <Image
        src="/assets/images/fake-properties/3.png"
        alt=""
        className="h-[250px] w-full rounded-t-lg"
        width={100}
        height={100}
      />
      <p className="p-2 text-sm font-bold">
        Private Cozy Clean, close to EVERYTHING <br />
        Nov 6 - 11, 2024
      </p>
    </div>
  );
}
