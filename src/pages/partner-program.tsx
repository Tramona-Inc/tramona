import Head from "next/head";
import Image from "next/image";

const steps = [
  {
    id: 1,
    info: "By having an account, you already have a code.",
  },
  {
    id: 2,
    info: "Send your link to a friend, and when they sign up you will automatically start to earn when they book a trip.",
  },
  {
    id: 3,
    info: "What are you waiting for? Start earning passive income.",
  },
];

function Card({ id, info }: { id: number; info: string }) {
  return (
    <div className="infline-flex max-w-[500px] items-center justify-center space-y-5 rounded-xl border border-black p-10">
      <div className="inline-flex rounded-2xl bg-black px-4 py-1 font-bold uppercase text-white">
        Step {id}
      </div>
      <p className="text-xl font-bold">{info}</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Head>
        <title>Partners | Tramona</title>
      </Head>
      <div className="bg-blue-300 px-[200px] py-20">
        <div className="container flex flex-row justify-between">
          {/* Partner Program */}
          <div className="flex flex-col gap-4">
            <p className="font-bold">LET&apos;S EARN TOGETHER</p>
            <h2 className="text-4xl font-bold sm:text-6xl">Partner Program</h2>
            <p className="mb-6 text-2xl font-bold sm:text-2xl">
              <span className="inline-block bg-yellow-200 shadow-sm">
                Earn 30% commission of revenue{" "}
              </span>{" "}
              for 12 months by simply introducing new customers to Tramona
            </p>
          </div>

          {/* Image */}
          <Image
            src={"/assets/images/partner-program.png"}
            height={301}
            width={325}
            alt="partner program"
          />
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center space-y-10 p-10">
        <h2 className="text-center text-4xl font-bold">
          What you need to know
        </h2>
        <div className="flex flex-col space-y-5 ">
          {steps.map((step) => (
            <Card key={step.id} {...step} />
          ))}
        </div>
      </div>
    </>
  );
}
