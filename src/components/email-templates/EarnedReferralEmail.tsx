import { Img, Section, Text } from "@react-email/components";
import * as React from "react";
import { Layout, Header, Footer, SocialLinks, Info, BottomHr, CustomButton } from './emailcomponents'

interface EarnedReferralEmailProps {
  userName?: string;
  earnedAmount?: number;
  totalAmount?: number;
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[];
}

const PropDefaults: EarnedReferralEmailProps = {
  userName: "John Doe",
  earnedAmount: 50,
  totalAmount: 500,
  steps: [],
  links: [],
};

export const EarnedReferralEmail = ({
  steps = PropDefaults.steps,
  links = PropDefaults.links,
  userName = PropDefaults.userName,
  earnedAmount = PropDefaults.earnedAmount,
  totalAmount = PropDefaults.totalAmount,
}: EarnedReferralEmailProps) => {
  return (
    <Layout title_preview="Money earned from a referral">
      <Header title="Money earned from a referral" />
      <Text className="text-left text-base px-6 text-brand">
        Hello {userName}. Your referral network is paying off. You just earned ${earnedAmount} from a referral. Your total is now ${totalAmount}.
      </Text>

      <Section className="text-center">
        <div className="bg-lightgrey inline-block py-3 w-11/12 mx-auto">
          <Text className="text-4xl font-bold text-brand">You earned ${earnedAmount}!</Text>
        </div>
      </Section>
      
      <Section className="text-center my-4">
        <div className="bg-lightgrey inline-block py-3 w-11/12 mx-auto">
          <Text className="text-4xl font-bold text-brand">${totalAmount}</Text>
          <Text className="text-sm font-semibold text-brand">Total earned</Text>
        </div>
      </Section>
      <CustomButton link="https://www.tramona.com/" title="View deal"/>
      <BottomHr/>
      <SocialLinks />
      <Footer/>
      <Info/>
    </Layout>
  );
};

export default EarnedReferralEmail;

  