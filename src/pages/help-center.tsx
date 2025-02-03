import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useChatWithAdmin } from "@/utils/messaging/useChatWithAdmin";
import {
  BugIcon,
  ChevronRight,
  LightbulbIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import bgImage from "@/../public/assets/images/beach.png";

export default function HelpCenter() {
  const chatWithAdmin = useChatWithAdmin();

  return (
    <DashboardLayout>
      <Head>
        <title>Help Center | Tramona</title>
      </Head>
      <div className="relative h-48 lg:h-64">
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt="beach"
            fill
            placeholder="blur"
            className="object-cover"
          />
        </div>
        <h1 className="absolute inset-0 flex items-center justify-center bg-opacity-50 text-center text-2xl font-extrabold lg:text-4xl">
          How can we help you?
        </h1>
      </div>
      <div className="p-4 py-16 pb-32">
        <div className="mx-auto max-w-3xl space-y-20">
          <div className="divide-y-2 *:py-4">
            <div>
              <h2 className="font-bold">Refunds & cancellations</h2>
              <p>
                Each property and host has different cancellation policies. Once
                you get matches, you will be able to see the policy each host is
                offering.{" "}
              </p>
              <br />
              <p>
                To request a refund, go to your{" "}
                <Link
                  href="/my-trips"
                  className="text-blue-600 underline underline-offset-2"
                >
                  My Trips
                </Link>{" "}
                page. Click on the trip and request a refund there. We will
                process your refund in less than 48 hours if applicable.
              </p>
            </div>
            <div>
              <h2 className="font-bold">Chat</h2>
              <p>
                For any non emergency needs or questions,{" "}
                <button
                  onClick={() => chatWithAdmin()}
                  className="text-blue-600 underline underline-offset-2"
                >
                  chat with us.
                </button>
              </p>
            </div>
            <div>
              <h2 className="font-bold">Emergencies</h2>
              <p>
                If it is an emergency regarding safety, please call 911. If it
                is an emergency regarding something Tramona can help with,
                please email us at:
                <br />
                <br />
                <a
                  href="mailto:info@tramona.com"
                  className="text-blue-600 underline underline-offset-2"
                >
                  info@tramona.com
                </a>
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:*:flex-1">
              <Button asChild variant="secondary" size="lg">
                <Link href="/support">
                  <LightbulbIcon />
                  Request a feature
                  <ChevronRight />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/support">
                  <BugIcon />
                  Report a bug
                  <ChevronRight />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/faq">
                  <MessageCircleQuestionIcon />
                  FAQ
                  <ChevronRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
