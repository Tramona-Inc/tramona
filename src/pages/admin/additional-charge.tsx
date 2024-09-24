import CreateAdditionalChargeForm from "@/components/admin/additional-charge/CreateAdditionalChargeForm";
import AllPreviousTrips from "@/components/admin/additional-charge/AllPreviousTrips";
import AllTripDamages from "@/components/admin/additional-charge/AllTripDamages";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
export default function Page() {
  return (
    <DashboardLayout>
      <div className="my-16 flex flex-col items-center justify-center gap-y-4">
        <div>
          <h1 className="text-3xl font-bold">
            {" "}
            Additional Charges for Previous Trips{" "}
          </h1>
        </div>
        <CreateAdditionalChargeForm />
        <AllTripDamages />
        <AllPreviousTrips />
      </div>
    </DashboardLayout>
  );
}
