import SettingsLayout from "@/components/_common/Layout/SettingsLayout";

export default function PaymentInformation() {
  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Payment Method</h1>
        </div>
      </div>
    </SettingsLayout>
  );
}
