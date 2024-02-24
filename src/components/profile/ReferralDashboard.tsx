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
    toast({ title: "Message saved!", description: "Copy it & share" });
  }

  if (isLoading) {
    return (
      <Button variant="ghost" disabled isLoading>
        Loading
      </Button>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-zinc-100 p-4">
        <p className="text-base text-muted-foreground">Referral Status</p>
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
      </section>
      <section className="space-y-2">
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
      </section>
    </div>
  );
}
