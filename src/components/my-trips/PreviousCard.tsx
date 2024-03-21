import Image from "next/image";
import Link from "next/link";

type PreviousCardProps = {
  name: string;
  offerId: number;
  date: string;
  image: string;
};

export default function PreviousCard(props: PreviousCardProps) {
  return (
    <Link
      href={`/offers/${props.offerId}`}
      className="border-2xl rounded-lg border shadow-xl"
    >
      <div className="relative h-[250px]">
        <Image
          src={props.image}
          alt=""
          className="absolute rounded-t-lg"
          objectFit="cover"
          fill
        />
      </div>
      <p className="p-3 text-sm font-bold">{props.name}</p>
      <p className="p-3 text-sm font-bold">{props.date}</p>
    </Link>
  );
}
