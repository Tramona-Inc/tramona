import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";

interface PropertyCardProps {
  index: number;
}

export function PropertyCard({ index }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-[#d7d7d7] p-0 shadow-none">
      <div className="relative aspect-[4/3]">
        <Image
          src="https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTA4OTQ5ODA0MDcwMTE4Mw%3D%3D/original/71d534a9-6699-4fe0-ad82-a9aaf0450b56.png?im_w=1440&im_q=highq"
          alt={`Property ${index + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 pt-0">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Bright Bungalo {index + 1}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">4.8</span>
          </div>
        </div>
        <p className="mb-2 text-sm font-normal text-muted-foreground">
          2 bed • 1 bath
        </p>
        <p className="mb-4 text-lg font-bold">
          $268 total{" "}
          <span className="text-detail text-sm font-normal">before taxes</span>
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button className="w-full" variant="primary">
            Book it Now
          </Button>
          <Button variant="outline" className="w-full border-[#c9c9c9]">
            Name Your Price
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
