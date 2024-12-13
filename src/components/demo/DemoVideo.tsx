import Link from 'next/link';

export default function DemoVideos() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

      {/* Header Section */}
      <section className="w-full text-center px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#000000] mb-4">
          See the Host-Side in Action
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          Discover how simple it is to manage bookings, connect with Airbnb, and fill your empty nights with ease. Watch our walkthrough to see it in action before you sign up.
        </p>
      </section>

      {/* Video Section */}
      <section className="flex flex-col items-center justify-center w-full max-w-5xl px-4">

        {/* Video Placeholder */}
        <div className="w-full h-64 md:h-96 lg:h-[500px] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center rounded-lg shadow-xl relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-500 text-lg md:text-2xl font-semibold">
              📹 Video coming soon!
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="flex items-center justify-center w-20 h-20 bg-[#004236] rounded-full shadow-lg hover:bg-[#006c4f] transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-10 h-10">
                <path d="M3 22V2l18 10-18 10z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Call-to-Action Below Video */}
        <div className="mt-8 text-center">
          <Link href="/host-onboarding">
            <button className="bg-[#004236] text-white text-lg font-medium py-3 px-8 rounded-lg shadow-md hover:bg-[#006c4f] transition duration-300">
              Start Hosting
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
