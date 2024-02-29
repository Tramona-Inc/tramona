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

interface NewOfferEmailProps {
  userName: string;
  originalPrice: number;
  tramonaPrice: number;
  description: string;
  property_image_link: string;
  countdown: Countdown;
  new_offer_link: string;
}

export const NewOfferEmail = ({
  userName = "User",
  description = "Private Cozy Clean, close to EVERYTHING",
  originalPrice = 220,
  tramonaPrice = 110,
  property_image_link = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  countdown = { days: 0, hours: 11, minutes: 30, seconds: 45 },
  new_offer_link = "https://www.tramona.com/",
}: NewOfferEmailProps) => {
  const totalHours = Math.round(
    countdown.days * 24 + countdown.hours + countdown.minutes / 60
  );
  return (
    <Layout title_preview="New offer has been received">
      <Header title="New offer has been received" />
      <Text className="text-left text-base text-brand px-6">
        Hello, {userName}. You currently have an offer that has been waiting for
        you for {totalHours} hours. Click here to check it out.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <EmailOfferCard
          originalPrice={originalPrice}
          tramonaPrice={tramonaPrice}
          description={description}
          property_image_link={property_image_link}
          countdown={countdown}
          offer_link={new_offer_link}
        />
      </Section>
      <CustomButton link={new_offer_link} title="View offer" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
};

export default NewOfferEmail;
