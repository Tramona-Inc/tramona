import Image from "next/image";

export const Features2 = () => {
  return (
    <section className="mb-12 mt-12 py-12">
      <div className="flex flex-col items-center space-y-12">
        {/* First Row: Image on left, text on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-request.png"
              objectFit="contain"
              layout="fill"
              alt="Requests"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            See all incoming requests for your empty nights, accept deny or
            reject them. Hosts can also set preferences so they only see
            requests that match their criteria.
          </h2>
        </div>

        {/* Second Row: Text on left, image on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row-reverse sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-cohost.png"
              objectFit="contain"
              layout="fill"
              alt="Cal"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            Easily invite a co-host to help manage your listing. We have
            multiple permissions to choose from. From full access to only being
            able to preform certain actions.
          </h2>
        </div>

        {/* Third Row: Image on left, text on right */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-x-16 gap-y-4 px-6 text-center sm:flex-row sm:text-left">
          <div className="relative h-40 w-72 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-md">
            <Image
              src="/assets/images/why-list/Why-list-cal.png"
              objectFit="contain"
              layout="fill"
              alt="Customized Pricing"
            />
          </div>
          <h2 className="text-md font-medium text-[#333]">
            Customize Tramona how you like. Put the prices you would consider,
            turn on or off instant booking, and sync your calendar directlly
            with Airbnb to eliminate double bookings.
          </h2>
        </div>
      </div>
    </section>
  );
};