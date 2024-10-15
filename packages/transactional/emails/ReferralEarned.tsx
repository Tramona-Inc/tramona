import React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface ReferralEmailProps {
  userName: string;
  earnedAmount: number;
  totalEarned: number;
  referralCode: string;
}

export default function ReferralEmail({
  userName = "John Doe",
  earnedAmount = 200.0,
  totalEarned = 1500.0,
  referralCode = "LNI81XP",
}: ReferralEmailProps) {
  const referralLink = "https://tramona.com/auth/signup?code=" + referralCode;

  return (
    <Layout title_preview="You earned money!">
      <div className="border-b border-gray-300 bg-white p-6">
        <Text className="mb-4 text-3xl font-bold">You earned money!</Text>
        <Text className="mb-8 text-left">
          Hello, {userName}. Your referral network is paying off. You just
          earned ${earnedAmount.toFixed(2)} from a referral. Your total is now $
          {totalEarned.toFixed(2)}.
        </Text>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <Text className="m-0 text-sm" style={{ color: "#6b728" }}>
              Amount
            </Text>
            <Text className="mt-0 text-2xl font-bold">
              ${earnedAmount.toFixed(2)}
            </Text>
          </div>
          <div>
            <Text
              className="m-0 text-sm"
              style={{ color: "#6b7280", marginBottom: "4px" }}
            >
              Total earned
            </Text>
            <Text className="mt-0 text-2xl font-bold">
              ${totalEarned.toFixed(2)}
            </Text>
          </div>
        </div>
        <Button
          href="https://www.tramona.com/account"
          className="mx-auto mb-4 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
        >
          View balance
        </Button>
        <div
          className="mx-auto my-6 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <div className="my-4 border-t border-gray-300"></div>
        <Text className="mb-4 text-center">
          Keep sharing your code to keep earning!
        </Text>
        <div>
          <div style={{ float: "left", width: "85%" }}>
            <Text
              className="m-0 px-4 py-2 no-underline"
              style={{
                background: "#f3f4f6",
                borderRadius: "8px",
                color: "black",
                textDecoration: "none",
              }}
            >
              {referralLink}
            </Text>
          </div>
          <div style={{ float: "right" }}>
            <Button
              className="text-md cursor-pointer rounded-md bg-green-900 px-4 py-[0.6em] text-center text-white"
              style={{ verticalAlign: "middle" }}
            >
              Copy
            </Button>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    </Layout>
  );
}
