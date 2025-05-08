import React from "react";
import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  EmailConfirmationCard,
  CustomButton,
} from "./EmailComponentsWithoutHost";
import { Text, Section } from "@react-email/components";

// Reuse the props from BookingConfirmationEmail
import { BookingConfirmationEmailProps } from "./BookingConfirmationEmail";

export default function OneWeekBeforeEmail({
  name,
  placeName,
  startDate,
  endDate,
  address,
  tripDetailLink,
}: BookingConfirmationEmailProps) {
  return (
    <Layout title_preview="One Week Until Your Stay">
      <Header title="One Week Until Your Stay!" />
      <Text className="text-brand px-6 text-left text-base">
        Hi {name}, your stay at {placeName} is only one week away! We can't wait to host you.
      </Text>
      <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
        <EmailConfirmationCard
          startDate={startDate}
          endDate={endDate}
          address={address}
          placeName={placeName}
          confirmation_link={tripDetailLink}
        />
      </Section>
      <CustomButton link={tripDetailLink} title="View trip details" />
      <Text className="text-brand px-6 text-left text-base">
        If you need anything, feel free to reach out. See you soon!
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}
