import MainLayout from '@/components/layouts/MainLayout';
import Link from 'next/link';
import React from 'react';
import PartnerProgram from '@/components/icons/PartnerProgramIcon';

export default function Page() {
  return (
    <MainLayout>
      <div className="bg-blue-300 px-10 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:justify-around">
          <div className="flex flex-col gap-4">
            <p className="font-bold">LET&apos;S EARN TOGETHER</p>
            <h2 className="text-4xl font-bold sm:text-6xl">Partner Program</h2>
            <p className="mb-6 text-2xl font-bold sm:text-2xl">
              <span className="inline-block bg-yellow-200 shadow-sm">Earn 30% commission of revenue </span> for 12
              months
              <br /> by simply introducing new customers to Tramona
            </p>
          </div>
          <PartnerProgram />
        </div>
      </div>

      <div className="bg-white p-10">
        <h2 className="text-center text-4xl font-bold sm:text-6xl">What you need to know</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="relative space-y-6 rounded-3xl border-2 border-black bg-gray-200 p-6">
            <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
              STEP 1
            </div>
            <p className="font-medium sm:text-xl">By having an account, you will earn a referral code</p>
            <Link
              className="text-md ml-auto block w-max rounded-lg border-2 border-black bg-blue-200 px-4 py-2 font-bold text-black hover:bg-blue-300"
              href="/profile"
            >
              Take me to my referral page &rarr;
            </Link>
          </div>
          <div className="relative space-y-6 rounded-3xl border-2 border-black bg-gray-200 p-6">
            <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
              STEP 2
            </div>
            <p className="font-medium sm:text-xl">
              Send your link to a friend, and when they sign up you will automatically start to earn when they book a
              trip
            </p>
          </div>
          <div className="relative space-y-6 rounded-3xl border-2 border-black bg-gray-200 p-6">
            <div className="absolute inset-x-0 -top-0 mx-auto w-24 -translate-y-1/2 rounded-full bg-black py-1 text-center text-sm font-bold text-white sm:text-base">
              STEP 3
            </div>
            <p className="font-medium sm:text-xl">What are you waiting for ? Start earning you passive income now !</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
