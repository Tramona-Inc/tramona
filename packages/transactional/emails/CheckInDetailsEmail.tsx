import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface CheckInDetailsEmailProps {
  userName: string;
  checkInDate: string;
  checkInTime: string;
  propertyAddress: string;
  wifiDetails?: string;
  houseRules?: string;
  doorCodeOrKeyPickup?: string;
  hostContact: string;
  dashboardLink: string;
}

export default function CheckInDetailsEmail({
  userName = "Traveler",
  checkInDate = "January 24",
  checkInTime = "3:00 PM",
  propertyAddress = "123 Main Street, Cityville",
  wifiDetails = "Network: CozyHome123 | Password: WelcomeHome",
  houseRules = "No smoking inside, quiet hours after 10 PM.",
  doorCodeOrKeyPickup = "Door Code: 5678 or Key Pickup: Lockbox by the front door.",
  hostContact = "John Doe, +1 (555) 123-4567",
  dashboardLink = "https://www.tramona.com/check-in-details",
}: CheckInDetailsEmailProps) {
  return (
    <Layout title_preview="Everything You Need for Your Stay - Check-In Details Enclosed!">
      <Text className="text-brand px-6 text-left text-base">
        Hello {userName},
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        Your trip is just around the corner! Here&apos;s everything you need for
        a smooth check-in experience.
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>Check-In Date:</strong> {checkInDate} at {checkInTime}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>Property Address:</strong> {propertyAddress}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>WiFi Details:</strong> {wifiDetails}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>House Rules:</strong> {houseRules}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>Access Instructions:</strong> {doorCodeOrKeyPickup}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <strong>Host Contact:</strong> {hostContact}
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        You can access these details anytime on your dashboard for peace of
        mind.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <CustomButton link={dashboardLink} title="View Check-In Instructions" />
      </Section>
    </Layout>
  );
}
