// import BathBoldIcon from "@/common/components/icons/bath-bold";
// import BedBoldIcon from "@/common/components/icons/bed-bold";
// import EmailIcon from "@/common/components/icons/email";
// import IdentityVerifiedIcon from "@/common/components/icons/identiy-verified";
// import OceanIcon from "@/common/components/icons/ocean";
// import StarIcon from "@/common/components/icons/star";
// import SuperHostIcon from "@/common/components/icons/superhost";
// import PaywallDialog from "@/common/components/paywall-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OfferDetailType } from "@/types";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import { StarIcon } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

function Divider(): JSX.Element {
  return <div className="mb-6 mt-6 border border-slate-300"></div>;
}

// function AmenityTemplate({ amenity }: { amenity: Amenity }): JSX.Element {
//   const style =
//     "flex flex-initial flex-col items-center justify-center rounded-xl border border-slate-300 p-4 text-sm font-bold text-zinc-800";
//   switch (amenity.type) {
//     case "Baths":
//       return (
//         <div className={style}>
//           {/* <BathBoldIcon /> */}
//           {(amenity as Baths).count} Bath
//         </div>
//       );
//     case "Beds":
//       return (
//         <div className={style}>
//           {/* <BedBoldIcon /> {(amenity as Beds).count} Bed */}
//         </div>
//       );
//     case "Ocean":
//       return <div className={style}>{/* <OceanIcon /> Ocean View */}</div>;
//   }
// }

// function ReadMore({ paragraph }: { paragraph: string }): JSX.Element {
//   const [open, setOpen] = useState<boolean>(false);

//   return (
//     <>
//       {open ? (
//         <>
//           {" "}
//           <p className="text-justify">{paragraph}</p>{" "}
//           <Button variant="link" className="p-0" onClick={() => setOpen(!open)}>
//             Close
//           </Button>
//         </>
//       ) : (
//         <>
//           {" "}
//           <p className="text-justify">
//             {paragraph.substring(0, 200) + "..."}
//           </p>{" "}
//           <Button variant="link" className="p-0" onClick={() => setOpen(!open)}>
//             Read More
//           </Button>
//         </>
//       )}
//     </>
//   );
// }

interface ListingsProps {
  offer: OfferDetailType;
}

export default function Listings() {
  const router = useRouter();

  const offerId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery({
    id: 12,
  });

  const { data: offer } = api.offers.getOfferWithRequestAndProperty.useQuery({
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
                Original Price: ${offer.property.originalNightlyPrice}/night
              </s>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="relative overflow-clip rounded-xl">
                <Image
                  src={offer.property.imageUrls?.[0] ?? "default"}
                  alt=""
                  className="inset-0 border object-cover object-center"
                  width={616}
                  height={521}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {offer.property.imageUrls?.slice(1).map((url, idx) => (
                  <div className="relative overflow-clip rounded-xl" key={idx}>
                    <Image
                      src={url}
                      alt=""
                      className="inset-0 border object-cover object-center"
                      width={271}
                      height={255}
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
                    <Image
                      src={"/assets/images/fake-properties/owners/2.png"}
                      alt=""
                      className="inset-0 border border-none object-cover object-center"
                      width={60}
                      height={60}
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
                    {/* {offer.verified ? <IdentityVerifiedIcon /> : null}
                    {offer.superHost ? <SuperHostIcon /> : null} */}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 gap-2 border-zinc-500 text-zinc-800 sm:w-fit"
                  >
                    {/* <EmailIcon /> Contact Host */}
                  </Button>
                </div>
                <Divider />
                {/** About this property */}
                <>
                  <h2 className="text-zinc-1000 mb-4 text-2xl font-semibold">
                    About this property
                  </h2>
                  {/* <ReadMore paragraph={offer.propertyDescription || ""} /> */}
                </>
                <Divider />
                {/** Guests Review */}
                <>
                  <h2 className="text-zinc-1000 mb-4 text-2xl font-semibold">
                    Guest Reviews
                  </h2>
                </>
                <Divider />
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
                        {/* <p>{offer.checkIn}</p> */}
                        <p className="text-xl font-bold text-zinc-800">
                          November 25 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </p>
                      </div>
                      <div className="col-span-1 border border-slate-300 p-4">
                        Check-out
                        {/* <p>{offer.checkOut}</p> */}
                        <p className="text-xl font-bold text-zinc-800">
                          November 28
                        </p>
                      </div>
                      <div className="col-span-2 border border-slate-300 p-4">
                        Guests
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
                              {/* <SelectLabel>Fruits</SelectLabel> */}
                              <SelectItem value="one">1 Guests</SelectItem>
                              <SelectItem value="two">2 Guests</SelectItem>
                              <SelectItem value="three">3 Guests</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* <PaywallDialog> */}
                      <Button className="w-full bg-[#FACF26] text-[#000000] hover:bg-[#FACF26]/90">
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
