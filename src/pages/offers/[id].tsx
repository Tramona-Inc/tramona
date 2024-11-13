// import BathBoldIcon from "@/common/components/icons/bath-bold";
// import BedBoldIcon from "@/common/components/icons/bed-bold";
// import EmailIcon from "@/common/components/icons/email";
// import IdentityVerifiedIcon from "@/common/components/icons/identiy-verified";
// import OceanIcon from "@/common/components/icons/ocean";
// import StarIcon from "@/common/components/icons/star";
// import SuperHostIcon from "@/common/components/icons/superhost";
// import PaywallDialog from "@/common/components/paywall-dialog";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { OfferPage } from "@/components/propertyPages/OfferPage";
import { api } from "@/utils/api";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Listings() {
  useSession({ required: true });
  const router = useRouter();
  const offerId = parseInt(router.query.id as string);

  const { data: offer } = api.offers.getByIdWithDetails.useQuery(
    { id: offerId },
    {
      enabled: router.isReady,
    },
  );

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Offer | Tramona</title>
      </Head>
      <div className="p-4 pb-64">
        <div className="mx-auto max-w-7xl">
          {offer ? <OfferPage offer={offer} /> : <Spinner />}
        </div>
      </div>
    </DashboardLayout>
  );
}
