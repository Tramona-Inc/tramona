import Image from "next/image";

export const Banner = () => {
  const image = "/assets/images/why-list/beach2.png";
  return (
    <section className="relative -mb-1">
      <div className="relative h-[40vh] w-full">
        <Image
          src={image}
          alt="beach banner"
          fill
          priority
          quality={100}
          placeholder="blur"
          blurDataURL={image}
          className="object-cover object-center"
        />
      </div>
      <span className="absolute inset-0 bg-black opacity-50"></span>
      <div className="absolute inset-0 flex items-center px-6">
        <div className="relative z-10 ml-1 max-w-4xl text-left text-white xl:mx-4">
          <h2 className="text-sm font-medium uppercase tracking-wide md:text-lg">
            FOR HOSTS
          </h2>
          <h3 className="mt-2 text-xl font-bold leading-snug md:text-3xl lg:text-4xl">
            The booking platform designed to help you fill every night with
            paying guests
          </h3>
          <p className="mt-4 text-sm md:text-base lg:text-lg">
            Earn 10-15% more annually by filling empty nights and paying less
            fees
          </p>
        </div>
      </div>
    </section>
  );
};