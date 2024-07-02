import MainLayout from "@/components/_common/Layout/MainLayout";
import Checkout from "@/components/requests/Checkout";

export default function Page() {
  return (
    <MainLayout>
      <div className="mx-auto my-16 max-w-5xl">
        <Checkout />
      </div>
    </MainLayout>
  );
}
