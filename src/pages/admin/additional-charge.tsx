import CreateAdditionalChargeForm from "@/components/admin/additional-charge/CreateAdditionalChargeForm";
import AllPreviousTrips from "@/components/admin/additional-charge/AllPreviousTrips";
import AllTripDamages from "@/components/admin/additional-charge/AllTripDamages";

export default function Page() {
  return (
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
  );
}
