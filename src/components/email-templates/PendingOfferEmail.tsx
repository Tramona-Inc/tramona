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
  offer_description: string;
  property_image_link: string;
  countdown: Countdown;
  offer_link: string;
}

export const PendingOfferEmail = ({
  offer_description = "Private Cozy Clean, close to EVERYTHING",
  originalPrice = 220,
  tramonaPrice = 110,
  property_image_link = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  countdown = { days: 2, hours: 12, minutes: 30, seconds: 45 },
  offer_link = "https://www.tramona.com/",
}: PendingOfferEmailProps) => {
  return (
    <Layout title_preview="Pending offer (Come book)">
      <Header title="Pending offer (Come book)" />
      <Text className="text-left text-base text-brand px-6">
        You just got an offer. Click here to check it out.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <EmailOfferCard
          originalPrice={originalPrice}
          tramonaPrice={tramonaPrice}
          description={offer_description}
          property_image_link={property_image_link}
          countdown={countdown}
          offer_link={offer_link}
        />
      </Section>
      <CustomButton link={offer_link} title="View offer" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
};

export default PendingOfferEmail;
