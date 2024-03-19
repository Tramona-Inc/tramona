import DesktopSearchBar from "../SearchBar/DesktopSearchBar";
import Image from "next/image";

export default function MastHead() {
  return (
    <>
      <section className="bg-gray-100 p-2 pt-4 md:px-2">
        <section className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center">
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
            <div className="mx-auto mb-8 max-w-3xl space-y-4">
              <h1 className="text-center text-3xl font-bold text-black md:text-6xl">
                Tramona is a name your own price tool
              </h1>
              <p className=" text-center text-xl text-black md:text-3xl">
                We match you with vacant dates from top performing Airbnb hosts,
                so you get better travel deals
              </p>
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
