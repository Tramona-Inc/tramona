import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

type ReviewCardProps = {
  name: string;
  profilePic: string;
  review: string;
  rating: number;
};

export default function ReviewCard({ name, profilePic, review, rating }: ReviewCardProps) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row gap-4">
      <Avatar className="w-14 h-14">
        <AvatarImage src={profilePic} alt={name} />
        <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
      </Avatar>
      <CardContent className="space-y-2">
        <div className='flex items-center gap-2'>
          <p className="text-black text-lg font-bold">{name}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{review}</p>
      </CardContent>
    </Card>
  );
}
