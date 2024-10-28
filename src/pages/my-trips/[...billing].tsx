import { useRouter } from "next/router";
import MyTrips from "@/pages/my-trips"; // Import your main MyTrips component

export default function BillingSubPages() {
  const router = useRouter();
  const { billing } = router.query; // Catch the dynamic path segments

  // Ensure billing is an array
  const billingArray = Array.isArray(billing)
    ? billing
    : billing
      ? [billing]
      : undefined;

  // Render the main MyTrips component with dynamic content based on the sub-route
  return <MyTrips billingRoute={billingArray} />;
}
