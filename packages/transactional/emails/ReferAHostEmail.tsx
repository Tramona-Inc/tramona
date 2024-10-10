/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Section, Text } from "@react-email/components";
import {
  BottomHr,
  CustomButton,
  Footer,
  Info,
  Layout,
  SocialLinks,
} from "./EmailComponents";

import { formatCurrency } from "@/utils/utils";
interface ReservationConfirmedEmailProps {
  referrerFirstAndLastName: string;
  referralCode: string;
}

export default function ReferAHostEmail({
  referrerFirstAndLastName = "A Tramona User",
  referralCode = "asdfasdfasdf",
}: ReservationConfirmedEmailProps) {
  return (
    <Layout title_preview="Reservation Confirmed">
      <div className="border-b border-gray-300 bg-white p-6 text-black">
        <Text className="mb-4 text-3xl font-bold text-black">
          {`${referrerFirstAndLastName} invited you to host on Tramona!`}
        </Text>
        <Text className="mb-4 text-left">
          Hi there,
          <br />
          {`${referrerFirstAndLastName}`} thought you&apos;d be a great addition
          to the Tramona host community! Sign up using their unique referral
          code and enjoy these awesome benefits:
          <ul className="ml-6 list-disc">
            <li> **Zero fees** on your first booking</li>
            <li> **$25 off** your next trip booked on Tramona</li>
          </ul>
        </Text>

        <Section className="my-4 text-center">
          <div className="bg-lightgrey mx-auto inline-block w-11/12 py-3">
            <Text className="text-brand mt-2 text-base">
              *To claim your rewards:* Enter this code when you sign up.
            </Text>
            <div
              className="rounded-lg bg-white px-6 py-4"
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
            <Text className="text-brand text-base">
              Ready to start hosting and earning?
            </Text>
          </div>
        </Section>

        <CustomButton link="https://www.tramona.com" title="Sign Up Now!" />
      </div>
      <Text className="text-brand px-6 text-left text-base">
        Questions? Feel free to reach out to us at info@tramona.com
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}
