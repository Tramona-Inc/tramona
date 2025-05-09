import MainLayout from "@/components/_common/Layout/MainLayout";
import { ProgramFrom } from "@/components/ambassador/ProgramForm";

export default function Page() {
  return (
    <MainLayout>
      <div className="bg-[#F2EBDC] py-20">
        <div className="container flex max-w-[1000px] flex-col items-center justify-between gap-10 text-neutral-900 lg:flex-row">
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

          {/* <div>
            <StartIcon2 />
          </div> */}
        </div>
      </div>

      <div className="container flex max-w-2xl flex-col py-10">
        <ProgramFrom />
      </div>
    </MainLayout>
  );
}
