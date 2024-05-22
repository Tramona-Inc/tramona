import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  BugIcon,
  ChevronRight,
  LightbulbIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

export default function HelpCenter() {
  const { mutateAsync: createConverstaionWithAdmin } =
    api.messages.createConversationWithAdmin.useMutation({
      onSuccess: (conversationId) => {
        void router.push(`/messages?conversationId=${conversationId}`);
      },
    });

  async function handleChat() {
    await createConverstaionWithAdmin();
  }

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Help Center | Tramona</title>
      </Head>
      <div className="relative h-48 lg:h-64">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/beach.png"
            alt="beach"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="absolute inset-0 flex items-center justify-center bg-opacity-50 text-center text-2xl font-bold lg:text-4xl">
          How can we help you?
        </h1>
      </div>
      <div className="p-4 py-16 pb-32">
        <div className="mx-auto max-w-3xl space-y-20">
          <div className="divide-y-2 *:py-4">
            <div>
              <h2 className="font-bold">Refunds & cancellations</h2>
              <p>
                Some of our properties have refunds while some do not. Please
                make sure you check what the policy is before booking. There is
                a 10% base service fee on every cancellation.
              </p>
            </div>
            <div>
              <h2 className="font-bold">Chat</h2>
              <p>
                For any non emergency needs or questions,{" "}
                <button
                  onClick={handleChat}
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
                please call:
                <br />
                <br />
                <a
                  href="tel:+1(425)628-3838"
                  className="text-blue-600 underline underline-offset-2"
                >
                  +1 (425) 628-3838
                </a>{" "}
                or{" "}
                <a
                  href="tel:+1(425)877-8881"
                  className="text-blue-600 underline underline-offset-2"
                >
                  +1 (425) 877-8881
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
