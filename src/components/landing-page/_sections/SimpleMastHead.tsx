import Image from "next/image";
import DesktopSearchBar from "../SearchBar/DesktopSearchBar";

export default function MastHead() {
  return (
    <>
      <section className="bg-white p-2 pt-4 md:px-2">
        <section className="relative flex flex-col justify-center">
          <div className="absolute inset-0 z-0 rounded-3xl">
            <Image
              src="/assets/images/landing-page/main.jpeg"
              alt="Main Background"
              fill
              priority
              style={{ objectFit: "cover" }}
              className="rounded-3xl"
            />
          </div>
          {/* <LandingVideo /> */}
          <div className="z-10 flex flex-col justify-center gap-4 p-4">
            <div className="mx-auto mb-8 max-w-5xl space-y-4 p-4">
              <h1 className="animate-text bg-gradient-to-r from-black via-neutral-500 to-black bg-clip-text pb-2 text-left text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl sm:leading-tight md:text-center lg:text-8xl lg:leading-relaxed">
                Name your own price.
              </h1>
            </div>

            <div className="mx-auto w-full max-w-5xl">
              <DesktopSearchBar />
            </div>
          </div>
        </section>
        {/* <section className="h-[45vh] bg-blue-800 xl:hidden">
        <FeedLanding />
      </section> */}
      </section>
    </>
  );
}
