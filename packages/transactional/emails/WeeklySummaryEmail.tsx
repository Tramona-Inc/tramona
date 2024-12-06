import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface WeeklySummaryEmailProps {
    userName: string;
    totalIncomingRequests: number;
    missedOpportunities: number;
    potentialEarnings: number; // Optional to emphasize financial impact
    requestsPageLink: string;
}

export default function WeeklySummaryEmail({
                                               userName = "Host",
                                               totalIncomingRequests = 0,
                                               missedOpportunities = 0,
                                               potentialEarnings = 0,
                                               requestsPageLink = "https://www.tramona.com/requests",
                                           }: WeeklySummaryEmailProps) {
    return (
        <Layout title_preview="Look at All the Booking Requests You Could Be Accepting!">
            <Text className="text-brand px-6 text-left text-base">
                Hello {userName},
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Over the past week/month, here’s a quick snapshot of your booking activity:
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                - Total Incoming Requests: {totalIncomingRequests}
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                - Missed Opportunities: {missedOpportunities}
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                - Potential Earnings Missed: ${potentialEarnings}
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Don’t let these opportunities slip away! Responding quickly to incoming requests ensures maximum occupancy and income.
            </Text>
            <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
                <CustomButton link={requestsPageLink} title="View All Incoming Requests" />
            </Section>
        </Layout>
    );
}
