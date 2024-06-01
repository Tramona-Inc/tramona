import React from 'react';
import { Text, Button } from '@react-email/components';
import { Layout } from './EmailComponents';

interface ReferralEmailProps {
  userName: string;
  earnedAmount: number;
  totalEarned: number;
  referralCode: string;
}

export default function ReferralEmail({
  userName = 'John Doe',
  earnedAmount = 200.00,
  totalEarned = 1500.00,
  referralCode = 'LNI81XP'
}: ReferralEmailProps) {
  let referralLink = 'https://tramona.com/auth/signup?code=' + referralCode;

  return (
    <Layout title_preview="You earned money!">
      <div className="p-6 bg-white border-b border-gray-300">
        <Text className="text-3xl font-bold mb-4">You earned money!</Text>
        <Text className="text-left mb-8">
          Hello, {userName}. Your referral network is paying off. You just earned ${earnedAmount.toFixed(2)} from a referral. Your total is now ${totalEarned.toFixed(2)}.
        </Text>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text className="text-sm m-0" style={{ color: '#6b728' }}>Amount</Text>
            <Text className="text-2xl font-bold mt-0">${earnedAmount.toFixed(2)}</Text>
          </div>
          <div>
            <Text className="text-sm m-0" style={{ color: '#6b7280', marginBottom: '4px' }}>Total earned</Text>
            <Text className="text-2xl font-bold mt-0">${totalEarned.toFixed(2)}</Text>
          </div>
        </div>
        <Button
          href="https://www.tramona.com/account"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-4 w-11/12 mx-auto"
        >
          View balance
        </Button>
        <div className="my-6 mx-auto w-full" style={{ borderBottom: '2px solid #e0e0e0' }}></div>
        <div className="border-t border-gray-300 my-4"></div>
        <Text className="text-center mb-4">Keep sharing your code to keep earning!</Text>
        <div>
          <div style={{ float: 'left', width: '85%' }}>
            <Text className="py-2 px-4 m-0 no-underline" style={{ background: '#f3f4f6', borderRadius: '8px', color: 'black', textDecoration: 'none' }}>
              {referralLink}
            </Text>
          </div>
          <div style={{ float: 'right' }}>
            <Button
              className="bg-green-900 text-white text-center py-[0.5em] px-4 text-md rounded-md cursor-pointer"
              style={{ verticalAlign: 'middle' }}
            >
              Copy
            </Button>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>
      </div>
    </Layout>
  );
}
