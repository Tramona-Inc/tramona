import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";

const steps = [
  {
    id: 1,
    info: "By having an account, you already have a code.",
    displayStar: true,
  },
  {
    id: 2,
    info: "Send your link to a friend, and when they sign up you will automatically start to earn when they book a trip.",
    displayStar: false,
  },
  {
    id: 3,
    info: "What are you waiting for? Start earning passive income.",
    displayStar: false,
  },
];

function Card({ id, info }: { id: number; info: string }) {
  return (
    <div className="infline-flex relative max-w-[500px] items-center justify-center space-y-5 rounded-xl border border-black p-10 max-sm:mt-10 max-sm:w-[350px]">
      <div className="inline-flex rounded-2xl bg-black px-4 py-1 font-bold uppercase text-white">
        Step {id}
      </div>
      <p className="text-xl font-bold">{info}</p>
    </div>
  );
}

export default function Page() {
  return (
    <MainLayout>
      <Head>
        <title>Partners | Tramona</title>
      </Head>
      <div className="bg-[#F2EBDC] py-20">
        <div className="container flex max-w-[1000px] flex-col items-center justify-between gap-10 lg:flex-row">
          <div className="flex flex-col gap-4">
            <p className="font-bold">LET&apos;S EARN TOGETHER</p>
            <h2 className="text-4xl font-bold sm:text-6xl">Partner Program</h2>
            <p className="mb-6 text-2xl font-bold sm:text-2xl">
              <span className="inline-block bg-yellow-200 shadow-sm">
                Earn $25 cash for each user&apos;s first booking!
              </span>{" "}
              for 12 months by simply introducing new customers to Tramona
            </p>
          </div>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center space-y-10 p-10">
        <h2 className="text-center text-4xl font-bold">
          What you need to know
        </h2>
        <div className="flex flex-col space-y-5">
          {steps.map((step) => (
            <Card key={step.id} {...step} />
          ))}
        </div>

        <p>
          * You can withdraw and check on your funds on the cash back balance
          page
        </p>

        <Link href="/auth/signup">
          <Button className="rounded-xl px-10 py-6 text-lg font-bold">
            Start referring
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
