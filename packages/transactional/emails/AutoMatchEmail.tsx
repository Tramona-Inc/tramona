import { Section, Text } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface AutoMatchEmailProps {
    userName: string;
    autoMatchSetupLink: string;
    successExample?: string; // Optional: Highlight a quick success story or testimonial
}

export default function AutoMatchEmail({
                                           userName = "Host",
                                           autoMatchSetupLink = "https://www.tramona.com/auto-match-setup",
                                           successExample = "Hosts using Auto Matches have seen a 35% increase in confirmed bookings and reduced the time spent managing requests.",
                                       }: AutoMatchEmailProps) {
    return (
        <Layout title_preview="Boost Your Bookings with Auto Matches!">
            <Text className="text-brand px-6 text-left text-base">
                Hello {userName},
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Are you spending too much time managing booking requests without seeing the results you want? It’s time to streamline your hosting experience with Auto Matches!
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                With Auto Matches, you can effortlessly connect with travelers and increase your booking rate. {successExample}
            </Text>
            <Text className="text-brand px-6 text-left text-base">
                Setting up Auto Matches is quick and easy, and it ensures you never miss an opportunity to fill your property.
            </Text>
            <Section className="flex justify-center px-6 pb-6" style={{ width: "100%" }}>
                <CustomButton link={autoMatchSetupLink} title="Set Up Auto Matches Now" />
            </Section>
        </Layout>
    );
}
