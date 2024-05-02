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
      : localStorage.getItem("referralMessage") ?? defaultMessage,
  );

  const code =
    user?.referralCodeUsed && data?.referralCode ? "" : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  const messageWithLink = `${message}\n\n${url}`;

  const [isEditingMessage, setIsEditingMessage] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();

  function saveReferralMessage() {
    localStorage.setItem("referralMessage", message);
    setMessage(message);
    toast({ title: "Message saved", description: "Copy it and share!" });
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto mt-10 min-h-screen-minus-header max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">My Referrals</h1>
        <p className="text-lg">
          Earn 30% of what we make off everyone you refer
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <section className="space-y-3 rounded-lg border p-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            <div className="col-span-2">
              <p className="text-4xl font-semibold">
                {formatCurrency(data?.totalBookingVolume ?? 0)}
              </p>
              <p>Total cash back</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/account"
              className={
                "text-sm font-bold hover:underline hover:underline-offset-2"
              }
            >
              View cash back
            </Link>
            <ChevronRight size={16} />
          </div>
        </section>
        <div className="col-span-2">
          <section className="space-y-2">
            <div>
              <h3 className="text-2xl font-semibold">
                Share your referral link
              </h3>
              <p className="text-base text-muted-foreground">
                Share your referral link by copying and sending it or sharing it
                on your social media.
              </p>
            </div>

            <div className="space-y-2">
              <Input value={url} className="text-base" disabled />
              <CopyToClipboardBtn
                message={url}
                render={({ justCopied, copyMessage }) => (
                  <Button size="lg" className="w-full" onClick={copyMessage}>
                    {justCopied ? "Copied!" : "Copy link"}
                  </Button>
                )}
              />
            </div>
          </section>
          <section className="space-y-2">
            <div>
              <h3 className="text-2xl font-semibold">Share a message</h3>
              <p className="text-base text-muted-foreground">
                Your referral link will be automatically added to the end of the
                message.
              </p>
            </div>

            <Textarea
              ref={textAreaRef}
              disabled={!isEditingMessage}
              defaultValue={`${message}`}
              onChange={(e) => setMessage(e.target.value)}
              className="h-24 text-base"
            />
            <div className="flex gap-2">
              <CopyToClipboardBtn
                message={messageWithLink}
                render={({ justCopied, copyMessage }) => (
                  <Button onClick={copyMessage} size="lg" className="flex-1">
                    {justCopied ? "Copied!" : "Copy message"}
                  </Button>
                )}
              />
              {isEditingMessage ? (
                <Button
                  onClick={() => {
                    saveReferralMessage();
                    setIsEditingMessage(false);
                  }}
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  Save
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsEditingMessage(true);
                    setTimeout(() => textAreaRef.current?.select(), 0);
                  }}
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  Edit message
                </Button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* <section className="rounded-xl bg-zinc-100 p-4">
        <p className="text-base text-muted-foreground">Referral Status</p>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold">
            {user?.referralTier}
            <Link
              href="/program"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm font-medium text-muted-foreground underline underline-offset-2"
            >
              Learn more
            </Link>
          </p>

          <div className="flex items-center gap-1">
            <Link
              href="/account"
              className={
                "text-sm font-medium hover:underline hover:underline-offset-2"
              }
            >
              See your earnings
            </Link>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="my-2 h-px bg-zinc-300"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-center text-4xl font-bold">
              {data?.numSignUpsUsingCode ?? "-"}
            </p>
            <p className="text-center text-base text-muted-foreground">
              referred
            </p>
          </div>
          <div>
            <p className="text-center text-4xl font-bold">
              {formatCurrency(data?.totalBookingVolume ?? 0)}
            </p>
            <p className="text-center text-base text-muted-foreground">
              total earnings
            </p>
          </div>
          <div>
            <p className="text-center text-4xl font-bold">
              {data?.numBookingsUsingCode ?? 0}
            </p>
            <p className="text-center text-base text-muted-foreground">
              bookings
            </p>
          </div>
        </div>
      </section> */}
      {/* <section className="space-y-2">
        <div>
          <h3 className="text-2xl font-semibold">Share your referral link</h3>
          <p className="text-base text-muted-foreground">
            Share your referral link by copying and sending it or sharing it on
            your social media.
          </p>
        </div>

        <div className="space-y-2">
          <Input value={url} className="text-base" disabled />
          <CopyToClipboardBtn
            message={url}
            render={({ justCopied, copyMessage }) => (
              <Button size="lg" className="w-full" onClick={copyMessage}>
                {justCopied ? "Copied!" : "Copy link"}
              </Button>
            )}
          />
        </div>
      </section>
      <section className="space-y-2">
        <div>
          <h3 className="text-2xl font-semibold">Share a message</h3>
          <p className="text-base text-muted-foreground">
            Your referral link will be automatically added to the end of the
            message.
          </p>
        </div>

        <Textarea
          ref={textAreaRef}
          disabled={!isEditingMessage}
          defaultValue={`${message}`}
          onChange={(e) => setMessage(e.target.value)}
          className="h-24 text-base"
        />
        <div className="flex gap-2">
          <CopyToClipboardBtn
            message={messageWithLink}
            render={({ justCopied, copyMessage }) => (
              <Button onClick={copyMessage} size="lg" className="flex-1">
                {justCopied ? "Copied!" : "Copy message"}
              </Button>
            )}
          />
          {isEditingMessage ? (
            <Button
              onClick={() => {
                saveReferralMessage();
                setIsEditingMessage(false);
              }}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => {
                setIsEditingMessage(true);
                setTimeout(() => textAreaRef.current?.select(), 0);
              }}
              size="lg"
              variant="outline"
              className="flex-1"
            >
              Edit message
            </Button>
          )}
        </div>
      </section> */}
    </div>
  );
}
