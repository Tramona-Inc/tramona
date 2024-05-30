import MainLayout from "@/components/_common/Layout/MainLayout";
import UnclaimedHeader from "@/components/unclaimed-offers/UnclaimedHeader";
import UnclaimedOfferCard from "@/components/unclaimed-offers/unclaimedOfferCard";
export default function Page() {
  return (
    <MainLayout>
      <div className="mt-16 flex flex-col items-center justify-center gap-y-5">
        <UnclaimedHeader />
        <UnclaimedOfferCard />
      </div>
    </MainLayout>
  );
}
