import { Star } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const sampleReviews = [
  {
    name: "Cynthia C.",
    date: "June 2023",
    content:
      "Overall, it was a great stay and we enjoyed. There are some things that need fixing at the condo. The master closet door and the master shower door need to be fixed.",
  },
  {
    name: "John D.",
    date: "July 2023",
    content:
      "Great location and comfortable stay. The host was very responsive to our needs.",
  },
  {
    name: "Emma S.",
    date: "August 2023",
    content:
      "Beautiful property with amazing views. Had a minor issue with the AC but it was quickly resolved.",
  },
  {
    name: "Michael R.",
    date: "September 2023",
    content:
      "Loved the amenities and the cleanliness of the place. Would definitely recommend!",
  },
  {
    name: "Sarah L.",
    date: "October 2023",
    content:
      "Perfect for our family vacation. The kids especially enjoyed the pool area.",
  },
  {
    name: "David W.",
    date: "November 2023",
    content:
      "Excellent value for money. The property exceeded our expectations in every way.",
  },
];

export function GuestReviews() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <h2 className="mb-4 text-[18px] font-bold lg:text-[24px]">
        Guest Reviews
      </h2>
      <div className="mb-4 flex flex-row items-center text-[14px] lg:text-[16px]">
        <Star className="mr-1 h-3 w-3 fill-[#004236] text-[#004236]" />
        <span className="rating font-bold">4.8</span>
        <span className="total-reviews ml-2">· 117 Reviews</span>
      </div>
      {/* desktop v. */}
      <div className="hidden lg:block">
        <div className="mb-6 grid grid-cols-2 gap-6">
          {sampleReviews.slice(0, 4).map((review, index) => (
            <Review key={index} {...review} />
          ))}
        </div>
        {sampleReviews.length > 4 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="">
                <button className="flex justify-start text-[16px] text-[#006F80]">
                  <u>Show all reviews</u>
                </button>
              </div>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto lg:max-w-4xl">
              <h2 className="mb-4 font-bold lg:text-2xl">All Reviews</h2>
              <div className="grid grid-cols-2 gap-6">
                {sampleReviews.map((review, index) => (
                  <Review key={index} {...review} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* mobile v.  */}
      <div className="lg:hidden">
        <div className="mb-6 grid grid-cols-1 gap-4">
          {sampleReviews.slice(0, 2).map((review, index) => (
            <Review key={index} {...review} />
          ))}
        </div>
        {sampleReviews.length > 2 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="">
                <button className="flex justify-start text-[16px] text-[#006F80]">
                  <u>Show all reviews</u>
                </button>
              </div>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto">
              <h2 className="mb-4 font-bold lg:text-2xl">All Reviews</h2>
              <div className="grid grid-cols-1 gap-6">
                {sampleReviews.map((review, index) => (
                  <Review key={index} {...review} />
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

const Review = ({
  name,
  date,
  content,
}: {
  name: string;
  date: string;
  content: string;
}) => {
  return (
    <div>
      <div className="review-header mb-1 flex justify-between">
        <span className="text-[16px] font-semibold text-[#222222]">{name}</span>
      </div>
      <div className="-mt-1 flex flex-row items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-3 w-3 fill-[#004236] text-[#004236]" />
        ))}
        <span className="text-[12px] text-[#888888]">{date}</span>
      </div>
      <p className="review-content text-[14px] text-[#606161]">{content}</p>
    </div>
  );
};
