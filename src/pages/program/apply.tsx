import StartIcon2 from "@/components/_icons/StartIcon2";

export default function Page() {
  return (
    <div>
      <div className="bg-[#3843D0] py-20">
        <div className="container flex max-w-[1000px] flex-col items-center justify-between gap-10 text-[#FFFFFF] lg:flex-row">
          {/* Partner Program */}
          <div className="flex flex-col gap-4">
            <p className="font-bold">LET&apos;S EARN TOGETHER</p>
            <h2 className="text-4xl font-bold sm:text-6xl">
              Ambassador Program
            </h2>
            <p className="mb-6 text-2xl font-bold sm:text-2xl">
              Please fill in the application form and someone from our
              partnership team will get in touch with you soon.
            </p>
          </div>

          <div>
            <StartIcon2 />
          </div>
        </div>
      </div>

      <div>Hello</div>
    </div>
  );
}
