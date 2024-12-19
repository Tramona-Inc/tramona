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

// Import the BookingConfirmationEmailProps interface for consistency
import { BookingConfirmationEmailProps } from "./BookingConfirmationEmail";

export default function TwoWeeksBeforeEmail({
  name,
  placeName,
  startDate,
  endDate,
  address,
  tripDetailLink,
}: BookingConfirmationEmailProps) {
  return (
    <Layout title_preview="Two Weeks Until Your Stay">
      <Header title="Two Weeks Until Your Stay!" />
      <Text className="text-brand px-6 text-left text-base">
        Hi {name}, your stay at {placeName} is just two weeks away! Here are the details:
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
        If you have any questions, feel free to reach out. Safe travels!
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}
