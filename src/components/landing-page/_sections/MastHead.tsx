import Image from "next/image";
import SearchBar from "../SearchBar/SearchBar";

export default function MastHead() {
  return (
    <section className="relative flex md:min-h-screen flex-col bg-white">
      <div className="relative w-full">
        <Image
          src="/assets/images/landing-page/main.png"
          alt="Main Background"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-[250px] w-full object-cover md:h-auto md:w-full"
        />
      </div>

      <div className="md:absolute left-0 right-0 z-10 px-8 pt-8 top-10 md:top-10">
        <h1 className="text-center text-3xl font-bold text-gray-900 md:text-5xl">
          The first perfectly efficient travel marketplace
        </h1>
        <p className="mt-2 text-center text-lg text-gray-700 md:text-xl">
          Shop the same properties you see on Airbnb, without the fees and
          Airbnb markup price
        </p>
      </div>

      <div className="mt-0 w-full px-8 mb-20 md:absolute md:-bottom-10 md:z-10 md:mt-40">
        <SearchBar />
        <hr className="block md:hidden h-px bg-gray-200 border-0"></hr>
        <p className="mt-5 text-center text-sm md:text-base text-gray-700">
          See a property you like? Make an offer and Tramona will create the deal for you.
          Don't see a property you like? Request a deal.
        </p>
      </div>
    </section>
  );
}
