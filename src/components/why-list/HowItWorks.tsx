import { FaInfoCircle, FaSlidersH, FaCheck } from "react-icons/fa";

export const HowItWorks = () => {
  return (
    <ul className="mx-auto mb-12 flex flex-col items-stretch gap-8 md:flex-row md:justify-center">
      {/* Book it Now */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          1. Book it Now
        </h3>
        <p className="mb-4 text-center font-medium md:text-left">
          Just like on Airbnb or Vrbo, your property is showcased beautifully.
          Travelers can instantly book their stay.
        </p>
        <div className="mt-6 flex items-center">
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>
        </div>
        <p className="mt-2 text-gray-500">
          When you sign up as a host, your Tramona account instantly syncs with
          Airbnb. Getting your availability, pricing, and other booking details.
        </p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="mt-4 flex items-center">
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>
        </div>
        <ul className="ml-1 mt-2">
          <li className="mb-1 flex items-center text-gray-500">
            <FaCheck className="mr-2" size={12} /> Choose between book it now or
            request to book.
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={18} /> Your property starts on
            request to book.
          </li>
        </ul>
      </li>

      {/* Receiving Bids */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          2. Receiving Bids
        </h3>
        <p className="mb-4 text-center font-medium md:text-left">
          Travelers can send offers for your vacant nights.
        </p>

        <div className="mt-6 flex items-center">
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>
        </div>
        <p className="mt-2 text-gray-500">
          Travelers can book instantly or place a bid. You can accept, reject,
          or set automatic rules to approve bids that meet your criteria. Only
          see the offers that match your preferences.
        </p>

        <hr className="my-4 border-t border-gray-300" />

        <div className="mt-4 flex items-center">
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>
        </div>

        <ul className="ml-1 mt-2">
          <li className="mb-1 flex items-center text-gray-500">
            <FaCheck className="mr-2" size={12} /> Choose to automatically
            accept bids that meet your hidden price preferences
          </li>
          <li className="mb-1 flex items-center text-gray-500">
            <FaCheck className="mr-2" size={12} /> Set preferences for offers
            you would consider, ignore the rest
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={12} /> If Book It Now is off,
            travelers can only submit bids
          </li>
        </ul>
      </li>

      {/* Receiving Requests */}
      <li className="flex flex-col rounded-xl bg-white p-6 text-left shadow-lg md:w-96">
        <h3 className="mb-4 text-center text-xl font-bold text-[primaryGreen]">
          3. Receiving Requests
        </h3>
        <p className="mb-4 text-center font-semibold md:text-left">
          Never let a night sit empty, always have options.
        </p>
        <div className="mt-6 flex items-center">
          <FaInfoCircle />
          <h4 className="ml-2 font-bold">How it Works:</h4>
        </div>
        <p className="mt-2 text-gray-500">
          Travelers specify their budget, dates, and preferences, and send a
          request. That request is sent to all hosts on Tramona with an empty
          night. Hosts have the option to accept, deny, or counteroffer all
          requests.
        </p>
        <hr className="my-4 border-t border-gray-300" />
        <div className="mt-4 flex items-center">
          <FaSlidersH />
          <h4 className="ml-2 font-bold">Your Flexibility:</h4>
        </div>
        <ul className="ml-1 mt-2">
          <li className="mb-1 flex items-center text-gray-500">
            <FaCheck className="mr-2" size={16} /> Choose to maually respond or
            automatically respond to each match.
          </li>
          <li className="flex items-center text-gray-500">
            <FaCheck className="mr-2" size={18} /> Flexibility to accept,
            decline or counteroffer all requests.
          </li>
        </ul>
      </li>
    </ul>
  );
};