import MainLayout from "@/components/_common/Layout/MainLayout";
import UnclaimedHeader from "@/components/unclaimed-offers/UnclaimedHeader";
import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
export default function Page() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center gap-y-5">
        <UnclaimedHeader />
        <UnclaimedOfferCards />
      </div>
    </MainLayout>
  );
}
