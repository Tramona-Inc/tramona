import React from "react";
import TravelerBillingTab from "./TravelerBillingTab";
import SecurityDepositOverview from "./travelerClaims/SecurityDepositOverview";
import PaymentHistoryOverview from "./PaymentHistoryOverview";
import { useRouter } from "next/router";

const nav = [
  {
    title: "Security Deposit",
    description: "Your security deposit for each trip in one place.",
    href: "/my-trips/billing/security-deposits",
  },
  {
    title: "Payment History",
    description: "View your past payment transactions.",
    href: "/my-trips/billing/payment-history",
  },
];

function BillingOverview() {
  const router = useRouter();
  const { tab } = router.query; // Get the tab query parameter from the URL

  // Check current path to decide which component to render
  const currentPath = router.asPath;

  return (
    <div>
      {/* If on the main billing page, show the navigation (default) */}
      {tab === "billing" &&
        !currentPath.includes("payment-history") &&
        !currentPath.includes("security-deposits") && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {nav.map((n, i) => (
              <TravelerBillingTab
                key={i}
                title={n.title}
                description={n.description}
                href={n.href}
                onClick={() =>
                  router.push(n.href, undefined, { shallow: true })
                }
              />
            ))}
          </div>
        )}

      {/* Render the appropriate component based on the URL */}
      {currentPath.includes("payment-history") && <PaymentHistoryOverview />}
      {currentPath.includes("security-deposits") && <SecurityDepositOverview />}
    </div>
  );
}

export default BillingOverview;
