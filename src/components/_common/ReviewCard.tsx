import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Stars from "@/components/_common/Stars";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useState, useEffect } from "react";

type ReviewCardProps = {
  name: string;
  profilePic: string;
  review: string;
  rating: number;
};

export default function ReviewCard({
  name,
  profilePic,
  review,
  rating,
}: ReviewCardProps) {
  const reviewRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const reviewElement = reviewRef.current;
    if (reviewElement) {
      setIsOverflowing(reviewElement.scrollHeight > reviewElement.clientHeight);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profilePic} alt={name} />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold">{name}</p>
        </div>
        <div className="flex items-center">
          <Stars rating={rating} size="small" />
        </div>
        <div className="z-20 max-w-2xl py-2 text-zinc-700">
          <div ref={reviewRef} className="line-clamp-3 break-words text-sm">
            {review}
          </div>
          {isOverflowing && (
            <div className="flex justify-start py-2">
              <Dialog>
                <DialogTrigger className="size-sm inline-flex items-center justify-center text-foreground underline underline-offset-2">
                  Show more
                  <ChevronRight className="ml-2" />
                </DialogTrigger>

                <DialogContent className="max-w-3xl p-8">
                  <DialogHeader>
                    <DialogTitle>{name}&apos;s Review</DialogTitle>
                  </DialogHeader>
                  <p className="whitespace-break-spaces break-words text-base">
                    {review}
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
