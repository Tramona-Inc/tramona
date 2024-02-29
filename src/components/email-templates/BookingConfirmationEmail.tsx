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
  EmailConfirmationCard,
} from "./EmailComponents";

interface BookingConfirmationEmailProps {
  userName: string;
  placeName: string;
  hostName: string;
  hostImageUrl: string;
  startDate: string;
  endDate: string;
  address: string;
  property_image_link: string;
  trip_detail_link: string;
}

export const BookingConfirmationEmail = ({
  userName = "User",
  placeName = "Tropical getaway in Mexico",
  hostName = "Host Name",
  hostImageUrl = "https://via.placeholder.com/150",
  startDate = "Nov 6",
  endDate = "Nov 11, 2024",
  address = "101 Street Planet Earth",
  property_image_link = "https://via.placeholder.com/600x300",
  trip_detail_link = "https://www.tramona.com/",
}: BookingConfirmationEmailProps) => {
  return (
    <Layout title_preview="Booking confirmation/Payment received">
      <Header title="Booking Confirmation/Payment Received" />
      <Text className="text-left text-base px-6 text-brand">
        Hello, {userName}. Your booking to {placeName} has been confirmed.
        Congrats and enjoy!
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <EmailConfirmationCard
          hostName={hostName}
          hostImageUrl={hostImageUrl}
          startDate={startDate}
          endDate={endDate}
          address={address}
          placeName={placeName}
          property_image_link={property_image_link}
          confirmation_link={trip_detail_link}
        />
      </Section>
      <CustomButton link={trip_detail_link} title="View trip detail" />
      <Text className="text-left text-base px-6 text-brand">
        If there are any questions, send us an email at info@tramona.com or send
        the host a message directly.
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
};

export default BookingConfirmationEmail;