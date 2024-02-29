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
  BookingCard,
} from "./EmailComponents";

interface BookingExpiredEmailProps {
  userName: string;
  offerPrice: number;
  checkIn: string;
  checkOut: string;
  location: string;
  originalPrice: number;
  tramonaPrice: number;
  description: string;
  image_link: string;
  trip_detail_link: string;
}

export const BookingExpiredEmail = ({
  userName = "User",
  offerPrice = 100,
  checkIn = "January 24",
  checkOut = "January 29",
  location = "101 Street, Any Place",
  description = "Private Cozy Clean, close to EVERYTHING",
  originalPrice = 220,
  tramonaPrice = 110,
  image_link = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  trip_detail_link = "https://www.tramona.com/",
}: BookingExpiredEmailProps) => {
  return (
    <Layout title_preview="Booking Expired">
      <Header title="Booking Expired" />
      <Text className="text-left text-base px-6 text-brand">
        Hello, {userName}. Your offer for ${offerPrice} on {checkIn} -{" "}
        {checkOut} at {location} has been removed.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <BookingCard
          checkIn={checkIn}
          checkOut={checkOut}
          originalPrice={originalPrice}
          tramonaPrice={tramonaPrice}
          description={description}
          property_image_link={image_link}
          isExpired={true}
          booking_link={trip_detail_link}
        />
      </Section>
      <CustomButton link={trip_detail_link} title="View trip detail" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
};

export default BookingExpiredEmail;
