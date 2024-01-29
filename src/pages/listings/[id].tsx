// import BathBoldIcon from "@/common/components/icons/bath-bold";
// import BedBoldIcon from "@/common/components/icons/bed-bold";
// import EmailIcon from "@/common/components/icons/email";
// import IdentityVerifiedIcon from "@/common/components/icons/identiy-verified";
// import OceanIcon from "@/common/components/icons/ocean";
// import StarIcon from "@/common/components/icons/star";
// import SuperHostIcon from "@/common/components/icons/superhost";
// import PaywallDialog from "@/common/components/paywall-dialog";
import UserAvatar from "@/components/_common/UserAvatar";
import EmailIcon from "@/components/_icons/EmailIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { cn, formatCurrency, formatDateMonthDay } from "@/utils/utils";
import { StarIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Listings() {
  const router = useRouter();

  const offerId = parseInt(router.query.id as string);

  const { data: offer } = api.offers.getByIdWithDetails.useQuery({
    id: offerId,
  });

  return (
    <>
      <Head>
        <title>Listings Property Preview | Tramona</title>
      </Head>
      {offer && (
        <div className="bg-zinc-100 px-4 pb-64 pt-8">
          <div className="mx-auto max-w-3xl xl:max-w-6xl">
            <div className="mb-4 flex flex-row flex-wrap items-center justify-center gap-4 text-3xl font-bold text-zinc-700">
              {offer.property.name}
              {/* // TODO: Get the offer price from redirection  */}
              <div className="flex flex-row items-center justify-center rounded-full bg-[#2F5BF6] px-8 text-sm text-white">
                {Math.round(
                  100 *
                    (1 -
                      (offer.totalPrice || 0) /
                        (offer.property.originalNightlyPrice || 0)),
                )}
                % off
              </div>
              <s className="text-sm font-bold">
                Original Price:{" "}
                {formatCurrency(offer.property.originalNightlyPrice)}/night
              </s>
            </div>
            <div
              className={cn(
                imagesLength === 1 ? "grid-cols-1" : "grid-cols-2 ",
                "mb-4 grid  gap-4",
              )}
            >
              <div className="relative h-[350px] w-full overflow-clip rounded-xl">
                <Image
                  src={offer.property.imageUrls?.[0] ?? "default"}
                  alt="airbnb image"
                  objectFit="cover"
                  fill
                />
              </div>
              <div
                className={cn(
                  imagesLength === 2 ? "grid-cols-1" : "grid-cols-2",
                  "grid gap-4",
                )}
              >
                {offer.property.imageUrls?.slice(1).map((url, idx) => (
                  <div className="relative overflow-clip rounded-xl" key={idx}>
                    <Image
                      src={url}
                      alt="airbnb image"
                      objectFit="cover"
                      fill
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid-cols-6 lg:grid">
              <div className="col-span-3">
                {/** Amenities */}
                <>
                  {" "}
                  <h2 className="text-zinc-1000 mb-4 text-2xl font-semibold">
                    Amenities
                  </h2>
                  {/* // TODO: add amenities to properties table */}
                  {/* <div className="grid grid-cols-4 gap-4">
                    {offer.amenites?.map((amenity: Amenity, idx) => (
                      <AmenityTemplate amenity={amenity} key={idx} />
                    ))}
                  </div> */}
                </>
                <Divider />
                {/** Host */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row items-center gap-4">
                    <UserAvatar
                      name={offer.property.hostName}
                      email={undefined}
                      image={offer.property.host?.image}
                    />
                    <p className="text-m font-bold text-zinc-800">
                      Hosted by {offer.property.hostName}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-12">
                    <div className="flex flex-row items-center">
                      <StarIcon />{" "}
                      <p className="text-zinc-1200 ml-1 text-sm">
                        {offer.property.numRatings} Reviews
                      </p>
                    </div>
                    {/* // TODO: get the host and is verified */}
                    {/* {offer.verified ? <IdentityVerifiedIcon /> : null} */}
                    {/* {offer.superHost ? <SuperHostIcon /> : null} */}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 gap-2 border-zinc-500 text-zinc-800 sm:w-fit"
                  >
                    <EmailIcon /> Contact Host
                  </Button>
                </div>
                <Divider />

                {/* * About this property */}
                <>
                  <h2 className="text-zinc-1000 mb-4 text-2xl font-semibold">
                    About this property
                  </h2>
                  {/* <ReadMore paragraph={offer.propertyDescription || ""} /> */}
                </>
                <Divider />
                {/** Guests Review */}
                {/* <>
                  <h2 className="text-zinc-1000 mb-4 text-2xl font-semibold">
                    Guest Reviews
                  </h2>
                </>
                <Divider /> */}
              </div>

              <div className="col-span-3">
                <div className="flex justify-center">
                  <div className="rounded-xl p-10 shadow-xl">
                    <span className="text-zinc-1000 text-3xl font-bold">
                      {formatCurrency(offer.property.originalNightlyPrice)}{" "}
                      <span className="text-2xl font-light"> / night</span>
                    </span>
                    <div className="my-6 grid grid-cols-2 rounded-xl border border-slate-300">
                      <div className="col-span-1 border border-slate-300 p-4">
                        Check-in
                        <p className="text-xl font-bold text-zinc-800">
                          {formatDateMonthDay(offer.request.checkIn)}
                        </p>
                      </div>
                      <div className="col-span-1 border border-slate-300 p-4">
                        Check-out
                        <p className="text-xl font-bold text-zinc-800">
                          {formatDateMonthDay(offer.request.checkOut)}
                        </p>
                      </div>
                      <div className="col-span-2 border border-slate-300 p-4">
                        Guests (max {offer.property.maxNumGuests})
                        <Select>
                          <SelectTrigger className="w-full border-none p-0 text-lg font-bold text-zinc-800 shadow-none focus:ring-0">
                            <SelectValue
                              placeholder={
                                offer.property.maxNumGuests + " Guests"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="border-none text-xl font-bold text-zinc-800">
                            <SelectGroup>
                              {Array.from(
                                { length: offer.property.maxNumGuests },
                                (_, index) => (
                                  <SelectItem
                                    key={index + 1}
                                    value={`${index + 1}`}
                                  >
                                    {index + 1}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* <PaywallDialog> */}
                      <Button variant="gold">
                        Join Tramona Lisa To Book This Stay!
                      </Button>
                      {/* </PaywallDialog> */}
                      <Button className="w-full border border-[#000000] bg-[#FFFFFF]  text-[#000000] hover:bg-[#FFFFFF]/90">
                        Pay one time unlock fee of $4.99 to unlock
                      </Button>
                    </div>
                    <p className="mt-2 text-center text-xs">
                      *one time unlock fee is 20% of total discount
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
