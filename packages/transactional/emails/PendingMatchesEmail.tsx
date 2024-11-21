import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface PendingMatchesEmailProps {
    userName: string;
    matchesPageLink: string;
}

export default function PendingMatchesEmail({
                                                userName = "Traveler",
                                                matchesPageLink = "https://www.tramona.com/matches",
                                            }: PendingMatchesEmailProps) {
    return (
        <Layout title_preview="Don't Miss Out! You Have Matches Waiting for Confirmation">
            <Text className="text-brand px-6 text-left text-base">
                Hello {userName},
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Exciting news! You have several matches waiting for your confirmation. These exclusive offers are only available for a limited time, so don't miss the opportunity to secure your perfect stay.
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Time is running out—review your options and book now before these deals expire!
            </Text>
            <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
                <CustomButton link={matchesPageLink} title="View Matches & Book" />
            </Section>
        </Layout>
    );
}
