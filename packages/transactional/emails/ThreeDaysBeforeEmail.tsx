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

// Use the existing props from BookingConfirmationEmail
import { BookingConfirmationEmailProps } from "./BookingConfirmationEmail";

export default function ThreeDaysBeforeEmail({
  name,
  placeName,
  startDate,
  endDate,
  address,
  tripDetailLink,
}: BookingConfirmationEmailProps) {
  return (
    <Layout title_preview="3 Days Until Your Stay">
      <Header title="3 Days Until Your Stay!" />
      <Text className="text-brand px-6 text-left text-base">
        Hi {name}, just 3 days until your stay at {placeName}! We're excited to welcome you.
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
        If you have any last-minute questions, feel free to reach out. Safe travels!
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}
