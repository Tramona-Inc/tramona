import { Card, CardContent, CardHeader } from "@/components/ui/card";

// import { Icons } from "@/components/_icons/icons";
import { type AppRouter } from "@/server/api/root";
import { formatCurrency, formatInterval } from "@/utils/utils";
import type { inferRouterOutputs } from "@trpc/server";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";

export type FeedWithInfo =
  inferRouterOutputs<AppRouter>["offers"]["getAllOffers"][number];

type Props = {
  offer: FeedWithInfo;
};

export default function FeedCard({ offer }: Props) {
  const name = offer.request.madeByUser.name?.split(" ") ?? [""];

  // const lastNameCensored =
  //   name.length > 1 ? "*".repeat(name[1].length) : "******";

  // Format the time when the offer was created
  const msAgo = Date.now() - offer.createdAt.getTime();
  const showTimeAgo = msAgo > 1000 * 60 * 60;
  const fmtdTimeAgo = showTimeAgo ? `${formatInterval(msAgo)}` : "";

  return (
    <Card className="flex flex-col justify-between py-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/general-profile">
            <UserAvatar name={name[0]} email={undefined} image={undefined} />
          </Link>

          <h1 className="font-bold">{name[0]}</h1>
          {/* //TODO: add username */}
          {/* <p className='text-secondary-foreground/60'>@{offers.user.username}</p> */}
        </div>

        {/* // TODO: when offer is accepted display date*/}
        <p className="text-sm text-secondary-foreground/60">{fmtdTimeAgo}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <h1 className="py-3 text-center text-2xl font-bold">
          {offer.property.name}
        </h1>
        <section className="grid h-[175px] grid-cols-2 place-items-center space-x-5">
          {/* Photos */}
          {offer.property.imageUrls.length === 1 ? (
            <div className="relative h-[170px] w-[170px]">
              <Image
                src={offer.property.imageUrls[0] ?? "default"}
                alt="Single Image"
                objectFit="cover"
                layout="fill"
              />
            </div>
          ) : (
            <div className="grid h-[170px] w-[170px] grid-cols-2 gap-5">
              {offer.property.imageUrls.map((image, index) => (
                <div key={image} className="relative">
                  <Image
                    src={image}
                    alt={`${index}`}
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="space-y-5 text-center">
            <div className="lg:space-y-1">
              <h1 className="text-xl font-bold">Tramona Price</h1>
              <h3 className="text-3xl font-bold text-primary">
                {formatCurrency(offer.totalPrice)}
                <span className="text-sm font-medium text-muted-foreground">
                  /night
                </span>
              </h3>
            </div>
            <div className="lg:space-y-1">
              <h1 className="text-xl font-bold">Original Price</h1>
              <h3 className="text-3xl font-bold text-primary">
                {formatCurrency(offer.property.originalNightlyPrice)}
                <span className="text-sm font-medium text-muted-foreground">
                  /night
                </span>
              </h3>
            </div>
          </div>
        </section>
      </CardContent>
      {/* <CardFooter className="flex flex-row justify-end space-x-5">
        <Icons.comment />
        <Icons.heart />
        <Icons.share />
        <Icons.bookmark />
      </CardFooter> */}
    </Card>
  );
}
