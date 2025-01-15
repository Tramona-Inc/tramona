import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { formatCurrency } from "@/utils/utils";
import Spinner from "../_common/Spinner";
import { ChevronRight } from "lucide-react";

export default function ReferralDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const { data, isLoading } = api.users.myReferralCode.useQuery();

  const code =
    user?.referralCodeUsed && data?.referralCode ? "" : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  if (isLoading) return <Spinner />;

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pb-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl p-4 sm:p-8">
        <div className="mb-8 flex flex-col items-start justify-between lg:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-[#004236]">My Referrals</h1>
            <p className="text-lg text-gray-600">
              Earn $25 cash for each user&apos;s first booking!
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Referral Status */}
          <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#004236]">
                Referral Status
              </h2>
              <Link
                href="/program"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#004236]"
              >
                Learn more
              </Link>
            </div>
            {/* <h3 className="text-lg font-bold text-[#004236] mt-4">
              {user?.referralTier}
            </h3> */}
            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
  icon?: React.ReactNode;
}

function StatusItem({ title, value, icon, centered }: StatusItemProps) {
  return (
    <div
      className={`flex flex-col items-center space-y-2 rounded-lg border p-4 ${
        centered ? "text-center sm:text-left" : ""
      }`}
    >
      {icon && <div className="text-2xl text-[#004236]">{icon}</div>}
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
    void navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard");
    });
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <h2 className="text-xl font-semibold text-[#004236]">{title}</h2>
      {showFooterMessage && (
        <p className="text-sm text-gray-500">
          Your referral link will be automatically added to the end of the
          message.
        </p>
      )}
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {message && (
        <div className="rounded-lg border border-gray-300 p-4 text-sm text-gray-600">
          {message}
        </div>
      )}
      {inputValue && (
        <div className="flex items-center">
          <input
            type="text"
            readOnly
            value={inputValue}
            className="flex-grow rounded-l-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="rounded-r-lg bg-[#004236] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#004236]"
          >
            {buttonText}
          </button>
        </div>
      )}
      {!inputValue && (
        <button
          onClick={handleCopy}
          className="rounded-lg bg-[#004236] px-4 py-2 text-white transition-colors duration-200 hover:bg-[#004236]"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
