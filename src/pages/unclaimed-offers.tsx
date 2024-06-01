import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import UnclaimedHeader from "@/components/unclaimed-offers/UnclaimedHeader";
import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import Link from "next/link";
export default function Page() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-y-5">
        <UnclaimedHeader />
        <UnclaimedOfferCards />
        <div className="my-4 flex flex-col items-center gap-y-3">
          <p>
            Dont see something you like? Make a request and get a match
            specifically tailored to your needs
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-teal-900 py-7 text-teal-900"
          >
            <Link href="/">Make a request </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
