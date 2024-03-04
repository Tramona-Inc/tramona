import { Section, Text } from "@react-email/components";
import { Layout, Header, CustomButton, BookingCard } from "./EmailComponents";

interface BookingAddedNotificationEmailProps {
  userName: string;
  checkIn: string;
  checkOut: string;
  originalPrice: number;
  tramonaPrice: number;
  description: string;
  propertyImageLink: string;
  tripDetailLink: string;
}

export function BookingAddedNotificationEmail({
  userName = "User",
  checkIn = "January 24",
  checkOut = "January 29",
  description = "Private Cozy Clean, close to EVERYTHING",
  originalPrice = 220,
  tramonaPrice = 110,
  propertyImageLink = "https://via.placeholder.com/600x300?text=Offer+Image+Here&bg=cccccc",
  tripDetailLink = "https://www.tramona.com/",
}: BookingAddedNotificationEmailProps) {
  return (
    <Layout title_preview="Your friend just added you to this booking">
      <Header title="Your friend just added you to this booking" />
      <Text className="text-brand px-6 text-left text-base">
        Hello! You just got added to a booking by {userName}.
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
          property_image_link={propertyImageLink}
          isExpired={false}
          booking_link={tripDetailLink}
        />
      </Section>
      <CustomButton link={tripDetailLink} title="View trip detail" />
    </Layout>
  );
}
