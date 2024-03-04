import { Section, Text } from "@react-email/components";
import { Layout, Header, CustomButton } from "./EmailComponents";

interface EarnedReferralEmailProps {
  userName: string;
  earnedAmount: number;
  totalEarnedAmount: number;
  referralCode: string;
  dealLink: string;
}

export function EarnedReferralEmail({
  userName = "User",
  earnedAmount = 50,
  totalEarnedAmount = 500,
  referralCode = "AH123",
  dealLink = "https://www.tramona.com/",
}: EarnedReferralEmailProps) {
  return (
    <Layout title_preview="Money earned from a referral">
      <Header title="Money earned from a referral" />
      <Text className="text-brand px-6 text-left text-base">
        Hello, {userName}. Your referral network is paying off. You just earned
        ${earnedAmount} from a referral. Your total is now ${totalEarnedAmount}.
      </Text>

      <Section className="text-center">
        <div className="bg-lightgrey mx-auto inline-block w-11/12 py-3">
          <Text className="text-brand text-4xl font-bold">
            You earned ${earnedAmount}!
          </Text>
        </div>
      </Section>

      <Section className="my-4 text-center">
        <div className="bg-lightgrey mx-auto inline-block w-11/12 py-3">
          <Text className="text-brand text-4xl font-bold">
            ${totalEarnedAmount}
          </Text>
          <Text className="text-brand text-sm font-semibold">Total earned</Text>
        </div>
      </Section>

      <Section className="my-4 text-center">
        <div className="bg-lightgrey mx-auto inline-block w-11/12 py-3">
          <Text className="text-brand text-base">
            Refer and get exclusive deals
          </Text>
          <div
            className="rounded-lg bg-white px-6"
            style={{
              border: "1px solid #DADADA",
              display: "inline-block",
              margin: "10px auto",
            }}
          >
            <Text className="text-brand text-4xl font-bold tracking-wider">
              {referralCode}
            </Text>
          </div>
        </div>
      </Section>

      <CustomButton link={dealLink} title="View deal" />
    </Layout>
  );
}
