import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function CustomerReview() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="h-96">
        <Image
          src="/assets/images/review-image.png"
          width={300}
          height={300}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 m-4">
        <div className="space-y-2 rounded-xl bg-primary/60 p-3 text-sm text-white">
          <p>
            &quot;My experience with Tramona has been wonderful. Any questions i
            have i hear back instantly, and the prices are truly unbeatable.
            Every time a friend is thinking of traveling i always recommend
            Tramona.&quot;
          </p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/assets/images/review-customer.png" />
            </Avatar>
            <p>Jack P from San Diego, CA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
