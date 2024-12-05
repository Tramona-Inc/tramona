import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface WelcomeHostEmailProps {
  userName: string;
  completeListingLink: string;
}

export default function WelcomeHostEmail({
  userName = "Host",
  completeListingLink = "https://www.tramona.com/complete-listing",
}: WelcomeHostEmailProps) {
  return (
    <Layout title_preview="Welcome to Tramona! Let's Start Booking Your Empty Nights">
      <Text className="text-brand px-6 text-left text-base">
        Hello {userName},
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        Welcome to Tramona! We&apos;re thrilled to have you join our community
        of hosts who are filling their empty nights with happy travelers.
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        Let&apos;s get your listing ready to attract guests. Completing your
        listing is quick and easy—just a few steps to showcase your space to
        thousands of potential travelers.
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        Ready to get started? Click below to complete your listing and unlock
        the full potential of your property.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <CustomButton link={completeListingLink} title="Complete My Listing" />
      </Section>
    </Layout>
  );
}
