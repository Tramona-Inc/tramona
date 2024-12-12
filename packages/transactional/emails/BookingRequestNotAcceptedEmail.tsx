import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface EmailProps {
  userType: "traveler" | "host";
  userName: string;
  tipsOrMessage?: string; // Tips for traveler or confirmation message for host
  actionButtonTitle: string;
  actionButtonLink: string;
}

export default function UnifiedEmail({
  userType = "traveler",
  userName = "User",
  tipsOrMessage = "",
  actionButtonTitle = "",
  actionButtonLink = "https://www.tramona.com/",
}: EmailProps) {
  const isTraveler = userType === "traveler";

  return (
    <Layout
      title_preview={
        isTraveler
          ? "Your Request Wasn't Accepted - Find More Deals!"
          : "You Rejected a Booking Request"
      }
    >
      <Text className="text-brand px-6 text-left text-base">
        Hello {userName},{" "}
        {isTraveler
          ? "unfortunately, your recent request wasn&apos;t accepted. Don&apos;t worry—there are still plenty of great options available for your trip!"
          : "you have successfully rejected a booking request. If you'd like to explore other potential guests, click below to view more requests."}
      </Text>
      {tipsOrMessage && (
        <Text className="text-brand px-6 text-left text-base">
          {tipsOrMessage}
        </Text>
      )}
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <CustomButton link={actionButtonLink} title={actionButtonTitle} />
      </Section>
    </Layout>
  );
}
