import MainLayout from "@/components/_common/Layout/MainLayout";
import Checkout from "@/components/requests/Checkout";

export default function Page() {
  return (
    <MainLayout>
      <div className="mx-auto my-4 min-h-screen-minus-header-n-footer max-w-5xl  sm:my-16">
        <Checkout />
      </div>
    </MainLayout>
  );
}
