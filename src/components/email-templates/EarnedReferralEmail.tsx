import { Section, Text } from "@react-email/components";
import * as React from "react";
import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  CustomButton,
} from "./EmailComponents";

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
  dealLink = "https://www.tramona.com/"
}: EarnedReferralEmailProps) {
  return (
    <Layout title_preview="Money earned from a referral">
      <Header title="Money earned from a referral" />
      <Text className="text-left text-base px-6 text-brand">
        Hello, {userName}. Your referral network is paying off. You just earned
        ${earnedAmount} from a referral. Your total is now ${totalEarnedAmount}.
      </Text>

      <Section className="text-center">
        <div className="bg-lightgrey inline-block py-3 w-11/12 mx-auto">
          <Text className="text-4xl font-bold text-brand">
            You earned ${earnedAmount}!
          </Text>
        </div>
      </Section>

      <Section className="text-center my-4">
        <div className="bg-lightgrey inline-block py-3 w-11/12 mx-auto">
          <Text className="text-4xl font-bold text-brand">
            ${totalEarnedAmount}
          </Text>
          <Text className="text-sm font-semibold text-brand">Total earned</Text>
        </div>
      </Section>

      <Section className="text-center my-4">
        <div className="bg-lightgrey inline-block py-3 w-11/12 mx-auto">
          <Text className="text-base text-brand">
            Refer and get exclusive deals
          </Text>
          <div
            className="rounded-lg px-6 bg-white"
            style={{
              border: "1px solid #DADADA",
              display: "inline-block",
              margin: "10px auto",
            }}
          >
            <Text className="text-4xl tracking-wider font-bold text-brand">
              {referralCode}
            </Text>
          </div>
        </div>
      </Section>

      <CustomButton link={dealLink} title="View deal" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}

export default EarnedReferralEmail;