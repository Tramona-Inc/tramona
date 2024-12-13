export default function DemoVideos() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-gray-50">
      {/* Header Section */}
      <section className="w-full md:w-3/4 lg:w-1/2 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
          Check out our host-side demo to see how easy and effective it is
        </h1>
      </section>

      {/* Video Section */}
      <section className="flex flex-col md:flex-row items-center justify-center w-full md:w-3/4 lg:w-1/2 gap-8">

        {/* Text Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg md:text-xl font-semibold text-center text-gray-700 mb-4 md:mb-0">
            Our intuitive design and flow makes managing your bookings, connecting with Airbnb, and filling your emptty nights, easy and effective.
          </h2>
        </div>

        {/* Video Placeholder */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full h-48 md:h-64 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center rounded-lg shadow-lg">
            <span className="text-gray-500 text-lg md:text-xl font-medium">
              📹 Video coming soon!
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}