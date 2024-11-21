import { Section, Text } from "@react-email/components";
import { Layout, CustomButton, BookingCard } from "./EmailComponents";

interface BookingAcceptedEmailProps {
    userType: "traveler" | "host";
    userName: string;
    propertyDescription?: string;
    checkIn?: string;
    checkOut?: string;
    bookingDetailsLink: string;
    actionButtonTitle: string;
}

export default function BookingAcceptedEmail({
                                                 userType = "traveler",
                                                 userName = "User",
                                                 propertyDescription = "A beautiful property waiting for your stay.",
                                                 checkIn = "January 24",
                                                 checkOut = "January 29",
                                                 bookingDetailsLink = "https://www.tramona.com/booking",
                                                 actionButtonTitle = "Secure My Booking",
                                             }: BookingAcceptedEmailProps) {
    const isTraveler = userType === "traveler";

    return (
        <Layout
            title_preview={
                isTraveler
                    ? "Good News! Your Request Was Accepted"
                    : "Booking Request Accepted - Waiting for Traveler Confirmation"
            }
        >
            <Text className="text-brand px-6 text-left text-base">
                Hello {userName},
            </Text>
            {isTraveler ? (
                <>
                    <Text className="text-brand px-6 text-left text-base">
                        Great news! Your request for the following property has been accepted:
                    </Text>
                    <BookingCard
                        description={propertyDescription}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        booking_link={bookingDetailsLink}
                        isExpired={false}
                    />
                    <Text className="text-brand px-6 text-left text-base">
                        Please confirm and secure your booking promptly to ensure your stay!
                    </Text>
                </>
            ) : (
                <>
                    <Text className="text-brand px-6 text-left text-base">
                        You have successfully accepted a booking request. We are now waiting for the traveler to confirm the booking.
                    </Text>
                </>
            )}
            <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
                <CustomButton link={bookingDetailsLink} title={actionButtonTitle} />
            </Section>
        </Layout>
    );
}
