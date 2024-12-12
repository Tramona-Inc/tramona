import { useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import Spinner from "../_common/Spinner";
import { ChevronRight } from "lucide-react";

const defaultMessage = `Hey! Join this new travel platform. They let people travel at any price they want. You name the price and they'll find a bnb out of your budget and make it work with your price. Here's the link, check it out:`;

export default function ReferralDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, isLoading } = api.users.myReferralCode.useQuery();

  const [message, setMessage] = useState(
    typeof window === "undefined"
      ? ""
      : localStorage.getItem("referralMessage") ?? defaultMessage
  );

  const code =
    user?.referralCodeUsed && data?.referralCode ? "" : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  const messageWithLink = `${message}\n\n${url}`;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#004236]">My Referrals</h1>
            <p className="text-lg text-gray-600">
              Earn $25 cash for each user's first booking!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Referral Status */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#004236]">
                Referral Status
              </h2>
              <Link
                href="/program"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-[#004236] transition-colors duration-200"
              >
                Learn more
              </Link>
            </div>
            {/* <h3 className="text-lg font-bold text-[#004236] mt-4">
              {user?.referralTier}
            </h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <StatusItem
                title="Referred"
                value={data?.numSignUpsUsingCode ?? "-"}
              />
              <StatusItem
                title="Bookings"
                value={data?.numBookingsUsingCode ?? 0}
              />
              <StatusItem
                title="Total cash back"
                value={formatCurrency(data?.totalBookingVolume ?? 0)}
                centered
              />
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/account/balance"
                className="text-sm font-bold hover:underline hover:underline-offset-2"
              >
                View cash back
              </Link>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Share Link and Message */}
          <div className="space-y-6">
            <ShareCard
              title="Share your referral link"
              description="Share your referral link by copying and sending it or sharing it on your social media."
              inputValue={url}
              buttonText="Copy"
            />
            <ShareCard
              title="Share a message"
              message={`Hey, check out this site, Tramona. You can name your own price on Airbnbs, and hosts offer you one-of-a-kind deals to try to get you to stay with them. They also charge less in fees than the other booking sites. Click this link and sign up (${url}) you’ll get 50% lower fees on your first trip, and I get a bounce back.`}
              buttonText="Copy message with link"
              showFooterMessage
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusItemProps {
  title: string;
  value: string | number;
  centered?: boolean;
}

function StatusItem({ title, value, icon, centered }: StatusItemProps) {
  return (
    <div
      className={`flex flex-col items-center border rounded-lg p-4 space-y-2 ${
        centered ? "text-center sm:text-left" : ""
      }`}
    >
      <div className="text-[#004236] text-2xl">{icon}</div>
      <div className="text-2xl font-bold text-[#004236]">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

interface ShareCardProps {
  title: string;
  description?: string;
  message?: string;
  inputValue?: string;
  buttonText: string;
  showFooterMessage?: boolean;
}

function ShareCard({
  title,
  description,
  message,
  inputValue = "",
  buttonText,
  showFooterMessage,
}: ShareCardProps) {
  const handleCopy = () => {
    const textToCopy = message ? message : inputValue;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard");
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#004236]">{title}</h2>
      {showFooterMessage && (
        <p className="text-sm text-gray-500">
          Your referral link will be automatically added to the end of the
          message.
        </p>
      )}
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {message && (
        <div className="border border-gray-300 rounded-lg p-4 text-sm text-gray-600">
          {message}
        </div>
      )}
      {inputValue && (
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={inputValue}
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="bg-[#004236] text-white px-4 py-2 rounded-r-lg hover:bg-[#004236] transition-colors duration-200"
          >
            {buttonText}
          </button>
        </div>
      )}
      {!inputValue && (
        <button
          onClick={handleCopy}
          className="bg-[#004236] text-white px-4 py-2 rounded-lg hover:bg-[#004236] transition-colors duration-200"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}