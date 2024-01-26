import Head from "next/head";
import Image from "next/image";

function Star() {
  return (
    <svg
      width="111"
      height="119"
      viewBox="0 0 111 119"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.1379 8.03503C32.6 16.9999 30.9053 18.7878 19.5239 19.8814C-0.149933 21.7718 -1.45732 39.3812 0.830843 44.8242C8.34962 56.6705 4.9718 67.0535 2.13871 70.7888C-4.66077 90.7676 12.2721 99.8938 19.524 98.3237C31.5591 98.3237 36.1959 105.047 39.1379 109.85C52.9984 126.243 66.7843 117.013 71.7675 109.85C81.1874 96.3097 88.7062 99.5736 94.6504 98.3237C112.384 94.5946 112.936 74.9882 109.034 70.1178C100.801 59.8415 107.726 49.9469 109.748 44.8242C114.264 26.8945 97.9604 20.0949 90.5507 19.8814C80.3515 19.8814 78.4555 14.7279 72.8084 8.035C58.9479 -6.05259 44.3683 1.31142 39.1379 8.03503Z"
        fill="#2F5BF6"
      />
    </svg>
  );
}

const steps = [
  {
    id: 1,
    info: "By having an account, you already have a code.",
    displayStar: true
  },
  {
    id: 2,
    info: "Send your link to a friend, and when they sign up you will automatically start to earn when they book a trip.",
    displayStar: false
  },
  {
    id: 3,
    info: "What are you waiting for? Start earning passive income.",
    displayStar: false
  },
];

function Card({
  id,
  info,
  displayStar,
}: {
  id: number;
  info: string;
  displayStar?: false;
}) {
  return (
    <div className="infline-flex relative max-w-[500px] items-center justify-center space-y-5 rounded-xl border border-black p-10">
      {displayStar && (
        <div className="absolute -right-[55px] -top-[60px]">
          <Star />
        </div>
      )}
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
