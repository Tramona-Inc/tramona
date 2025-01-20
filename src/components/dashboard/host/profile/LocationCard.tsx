import Image from "next/image";

interface LocationCardProps {
  city: string;
  country: string;
  icon: string;
}

export function LocationCard({ city, country, icon }: LocationCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border p-4">
      <div className="relative mb-2 h-16 w-16">
        <Image
          src={icon || "/placeholder.svg"}
          alt={`${city} icon`}
          fill
          className="object-contain"
        />
      </div>
      <p className="text-sm font-medium">{city}</p>
      <p className="text-sm text-muted-foreground">{country}</p>
    </div>
  );
}
