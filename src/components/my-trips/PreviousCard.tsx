import Image from "next/image";

type PreviousCardProps = {
  name: string;
  date: string;
  image: string;
};

export default function PreviousCard(props: PreviousCardProps) {
  return (
    <div className="border-2xl rounded-lg border shadow-xl">
      <div className="relative h-[250px]">
        <Image
          src={props.image}
          alt=""
          className="absolute rounded-t-lg"
          objectFit="cover"
          fill
        />
      </div>
      <p className="p-2 text-sm font-bold">{props.name}</p>
    </div>
  );
}
