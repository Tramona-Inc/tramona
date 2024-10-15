import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
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
import { type Review } from "@/server/db/schema";

export default function ReviewCard({ review, backupReview }: { review: Review, backupReview: string }) {
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
      {review.profilePic ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.profilePic} alt={review.name} />
          <AvatarFallback>
            {review.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ) : (
        // <AnonymousAvatar className="h-10 w-10" />
        <Avatar className="h-10 w-10">
          <AvatarImage src={backupReview} alt={review.name} />
          <AvatarFallback>
            {review.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div>
        <p className="font-bold">{review.name}</p>
        <div className="flex">
          <Stars rating={review.rating} size="small" />
        </div>
        <div className="z-20 max-w-2xl py-2 text-zinc-600">
          <div ref={reviewRef} className="line-clamp-3 break-words text-sm">
            {review.review}
          </div>
          {isOverflowing && (
            <div className="flex justify-start py-2">
              <Dialog>
                <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
                  Show more
                  <ChevronRight className="ml-2 size-4" />
                </DialogTrigger>

                <DialogContent className="max-w-3xl p-8">
                  <DialogHeader>
                    <DialogTitle>{review.name}&apos;s Review</DialogTitle>
                  </DialogHeader>
                  <p className="whitespace-break-spaces break-words text-base">
                    {review.review}
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
