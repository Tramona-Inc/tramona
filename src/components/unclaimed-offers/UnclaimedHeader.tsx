import Link from "next/link";
import UnclaimedCitySearch from "./UnclaimedCitySearch";
import { imageSVG } from "@/components/unclaimed-offers/UnclaimedSVG";

export default function UnclaimedHeader() {
  return (
    <div className="relative flex w-full flex-row items-center justify-start bg-[#F1F5F5]">
      <div className=" flex flex-col justify-center gap-y-4 p-20 px-28 text-start">
        <h1 className="text-5xl font-semibold">Unclaimed Matches</h1>
        <div className="mt-2 text-lg">
          Have a friend thinking of traveling? Share a deal with them and earn{" "}
          <br /> a 30% revenue split.{" "}
          <Link
            href="/referral"
            className="text-teal-700 underline underline-offset-2"
          >
            Learn more
          </Link>
        </div>
        <div className="text-sm font-semibold">
          Once they book, the money will be deposited directly to your referral
          dashboard.
        </div>
        <UnclaimedCitySearch />
      </div>
      <div className="xl:right-42 absolute bottom-0 hidden rounded-full lg:right-0 lg:block">
        {imageSVG}
      </div>
    </div>
  );
}
