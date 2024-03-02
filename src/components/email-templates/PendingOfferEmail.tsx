import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  CustomButton,
  EmailOfferCard,
} from "./EmailComponents";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface PendingOfferEmailProps {
  originalPrice: number;
  tramonaPrice: number;
  offerDescription: string;
  propertyImageLink: string;
  countdown: Countdown;
  offerLink: string;
}

export function PendingOfferEmail({
  originalPrice = 220,
  tramonaPrice = 110,
  offerDescription = "Private Cozy Clean, close to EVERYTHING",
  propertyImageLink = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  countdown = { days: 2, hours: 12, minutes: 30, seconds: 45 },
  offerLink = "https://www.tramona.com/"
}: PendingOfferEmailProps) {
  return (
    <Layout title_preview="Pending offer (Come book)">
      <Header title="Pending offer (Come book)" />
      <Text className="text-left text-base text-brand px-6">
        You just got an offer. Click here to check it out.
      </Text>
      <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
        <EmailOfferCard
          originalPrice={originalPrice}
          tramonaPrice={tramonaPrice}
          description={offerDescription}
          property_image_link={propertyImageLink}
          countdown={countdown}
          offer_link={offerLink}
        />
      </Section>
      <CustomButton link={offerLink} title="View offer" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}

export default PendingOfferEmail;