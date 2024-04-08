import { Section, Text } from "@react-email/components";
import { Layout, CustomButton, BookingCard } from "./EmailComponents";

interface BookingExpiredEmailProps {
  userName: string;
  offerPrice: number;
  checkIn: string;
  checkOut: string;
  location: string;
  originalPrice: number;
  tramonaPrice: number;
  description: string;
  imageLink: string;
  tripDetailLink: string;
}

export function BookingExpiredEmail({
  userName = "User",
  offerPrice = 100,
  checkIn = "January 24",
  checkOut = "January 29",
  location = "101 Street, Any Place",
  description = "Private Cozy Clean, close to EVERYTHING",
  originalPrice = 220,
  tramonaPrice = 110,
  imageLink = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  tripDetailLink = "https://www.tramona.com/",
}: BookingExpiredEmailProps) {
  return (
    <Layout title_preview="Booking Expired">
      <Text className="text-brand px-6 text-left text-base">
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
          property_image_link={imageLink}
          isExpired={true}
          booking_link={tripDetailLink}
        />
      </Section>
      <CustomButton link={tripDetailLink} title="View trip detail" />
    </Layout>
  );
}
