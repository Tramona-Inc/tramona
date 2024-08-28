import { useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useToast } from "@/components/ui/use-toast";
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
      : (localStorage.getItem("referralMessage") ?? defaultMessage),
  );

  const code =
    user?.referralCodeUsed && data?.referralCode ? "" : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  const messageWithLink = `${message}\n\n${url}`;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();

  function saveReferralMessage() {
    localStorage.setItem("referralMessage", message);
    setMessage(message);
    toast({ title: "Message saved", description: "Copy it and share!" });
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-8 pb-20 lg:pt-16">
      <div className="space-y-2 border-b p-4 lg:border-0 lg:p-0">
        <h1 className="text-2xl font-bold lg:text-4xl">My Referrals</h1>
        <p className="text-sm lg:text-lg">
          Earn $25 cash for each user&apos;s first booking!
        </p>
      </div>
      <div className="grid grid-cols-1 space-y-2 lg:grid-cols-3 lg:gap-4 lg:space-y-0">
        <section className="space-y-6 rounded-lg border p-4">
          <div>
            <div className="flex justify-between">
              <p className="text-base">Referral Status</p>
              <Link
                href="/program"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm font-medium underline underline-offset-2"
              >
                Learn more
              </Link>
            </div>
            <p className="text-2xl font-semibold">{user?.referralTier}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-r-2">
              <p className="text-4xl font-semibold">
                {data?.numSignUpsUsingCode ?? "-"}
              </p>
              <p>Referred</p>
            </div>
            <div>
              <p className="text-4xl font-semibold">
                {data?.numBookingsUsingCode ?? 0}
              </p>
              <p>Bookings</p>
            </div>
            <div className="col-span-2 border-t-2 pt-4">
              <p className="text-4xl font-semibold">
                {formatCurrency(data?.totalBookingVolume ?? 0)}
              </p>
              <p>Total cash back</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/account/balance"
              className={
                "text-sm font-bold hover:underline hover:underline-offset-2"
              }
            >
              View cash back
            </Link>
            <ChevronRight size={16} />
          </div>
        </section>
        <div className="col-span-2 space-y-10 rounded-lg p-4">
          <section className="space-y-2">
            <h3 className="text-xl font-bold">Share your referral link</h3>
            <p className="text-sm">
              Share your referral link by copying and sending it or sharing it
              on your social media.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex-1">
                <Input value={url} readOnly />
              </div>
              <CopyToClipboardBtn
                message={url}
                render={({ justCopied, copyMessage }) => (
                  <Button
                    onClick={copyMessage}
                    className="bg-teal-900 px-0 lg:w-20"
                  >
                    {justCopied ? "Copied!" : "Copy"}
                  </Button>
                )}
              />
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xl font-bold">Share a message</h3>
            <p className="text-sm">
              Your referral link will be automatically added to the end of the
              message.
            </p>

            <Textarea
              ref={textAreaRef}
              // disabled={!isEditingMessage}
              defaultValue={`${message}`}
              onChange={(e) => setMessage(e.target.value)}
              className="h-36 text-base lg:h-24"
            />
            <div className="flex justify-end">
              <CopyToClipboardBtn
                message={messageWithLink}
                render={({ justCopied, copyMessage }) => (
                  <Button
                    onClick={copyMessage}
                    className="w-full bg-teal-900 px-6 lg:w-auto"
                  >
                    {justCopied ? "Copied!" : "Copy"}
                  </Button>
                )}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
