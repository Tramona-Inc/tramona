import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Icons } from "@/components/_icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type AppRouter } from "@/server/api/root";
import { formatCurrency } from "@/utils/utils";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";

export type FeedWithInfo =
  inferRouterOutputs<AppRouter>["offers"]["getAllOffers"][number];

type Props = {
  offer: FeedWithInfo;
};

export default function FeedCard({ offer }: Props) {
  // const lastNameCensored =
  //   name.length > 1 ? "*".repeat(name[1].length) : "******";

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/general-profile">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {/* // TODO: get the request that the user  */}
                {/* {offer.hostName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")} */}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* <h1 className="font-bold">{firstName + " " + lastNameCensored}</h1> */}
          {/* <h1 className="font-bold">{firstName}</h1> */}
          {/* <p className='text-secondary-foreground/60'>@{offers.user.username}</p> */}
        </div>

        <p className="text-sm text-secondary-foreground/60">
          {/* {offers.posting.date} */}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <h1 className="text-center text-2xl font-bold">
          {offer.request.madeByUser.name}
        </h1>
        <section className="grid h-[175px] grid-cols-2 place-items-center space-x-5">
          {/* Photos */}
          <div className="grid grid-cols-2 gap-5">
            {/* {offer.posting.images_url.map((index, url) => (
							<div
								key={`image_${index}_${url}`}
								className='h-[75px] w-[75px] rounded-lg bg-black'
							/>
						))} */}

            <div className="h-[50px] w-[50px] rounded-lg bg-black lg:h-[75px] lg:w-[75px]" />
            <div className="h-[50px] w-[50px] rounded-lg bg-black lg:h-[75px] lg:w-[75px]" />
            <div className="h-[50px] w-[50px] rounded-lg bg-black lg:h-[75px] lg:w-[75px]" />
            <div className="h-[50px] w-[50px] rounded-lg bg-black lg:h-[75px] lg:w-[75px]" />
          </div>

          {/* Price */}
          <div className="space-y-5 text-center">
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Tramona Price</h1>
              <h3 className="text-2xl font-bold text-primary">
                {formatCurrency(offer.totalPrice)}
                <span className="text-secondary-foreground">/night</span>
              </h3>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold">Original Price</h1>
              <h3 className="text-2xl font-bold text-primary">
                {formatCurrency(offer.property.originalNightlyPrice)}
                <span className="text-secondary-foreground">/night</span>
              </h3>
            </div>
          </div>
        </section>
      </CardContent>
      <CardFooter className="flex flex-row justify-end space-x-5">
        <Icons.comment />
        <Icons.heart />
        <Icons.share />
        <Icons.bookmark />
      </CardFooter>
    </Card>
  );
}
