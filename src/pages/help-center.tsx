import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { ChevronRight } from "lucide-react";
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
      <div className="relative h-64">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/beach.png"
            alt="beach"
            fill
            className="object-cover"
          />
        </div>
        <h1 className="absolute inset-0 flex items-center justify-center bg-opacity-50 text-4xl font-bold">
          How can we help you?
        </h1>
      </div>
      <div className="mx-auto mb-20 mt-20 max-w-3xl space-y-20">
        <div className="grid grid-cols-1 gap-4 divide-y-2">
          <div>
            <h2 className="font-bold">Refunds & cancellations</h2>
            <p>
              Some of our properties have refunds while some do not. Please make
              sure you check what the policy is before booking. There is a 10%
              base service fee on every cancellation.
            </p>
          </div>
          <div>
            <h2 className="pt-4 font-bold">Chat</h2>
            <p>
              For any non emergency needs or questions{" "}
              <a
                onClick={handleChat}
                className="text-blue-500 underline hover:cursor-pointer"
              >
                chat with us.
              </a>
            </p>
          </div>
          <div>
            <h2 className="pt-4 font-bold">Emergencies</h2>
            <p>
              If it is an emergency regarding safety, please call 911. If it is
              an emergency regarding something Tramona can help with please
              call:
              <br />
              <br />
              <span className="text-blue-600">+1 (425) 628 3838</span> or{" "}
              <span className="text-blue-600">+1 (425) 877-8881</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <Link href="/support">
              <Button
                variant="outline"
                className="w-full justify-between border-zinc-300"
                size="lg"
              >
                Request a feature <ChevronRight />
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <Link href="/support">
              <Button
                variant="outline"
                className="w-full justify-between border-zinc-300"
                size="lg"
              >
                Report a bug <ChevronRight />
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <Link href="/faq">
              <Button
                variant="outline"
                className="w-full justify-between border-zinc-300"
                size="lg"
              >
                FAQ <ChevronRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
