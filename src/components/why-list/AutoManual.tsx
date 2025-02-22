import { RiRobot2Line } from "react-icons/ri";
import {
  BsLightningCharge,
  BsCalendar4,
  BsSliders,
  BsClipboard,
  BsPerson,
} from "react-icons/bs";
import { FaRegHandshake } from "react-icons/fa";

export const AutoManual = () => {
  return (
    <div className="mx-6 grid gap-8 sm:grid-cols-1 md:grid-cols-2">
      {/* Automation Section */}
      <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <RiRobot2Line className="mr-2 text-2xl text-primaryGreen" />
          <h3 className="text-xl font-bold">Automation</h3>
        </div>
        <p className="mb-4 text-center text-gray-500">
          Automate everything. Save time with your rental.
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <BsLightningCharge className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Instant Matching:</strong> Automatically respond to
              matches based on your preferences.
            </p>
          </div>
          <div className="flex items-start">
            <BsCalendar4 className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Book It Now:</strong> Enable travelers to book instantly
              without needing approval.
            </p>
          </div>
          <div className="flex items-start">
            <BsSliders className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Custom Rules:</strong> Set a hidden discount for dates not
              booked a certain number of days out.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Ideal for saving time and maximizing occupancy.
        </p>
      </div>

      {/* Manual Section */}
      <div className="flex flex-col rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <FaRegHandshake className="mr-2 text-2xl text-primaryGreen" />
          <h3 className="text-xl font-bold">Manual</h3>
        </div>
        <p className="mb-4 text-center text-gray-500">
          Manually decide which bookings you allow.
        </p>
        <div className="space-y-4">
          <div className="flex items-start">
            <BsClipboard className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Set request to book:</strong> Approve each booking
              manually.
            </p>
          </div>
          <div className="flex items-start">
            <BsPerson className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Respond to requests:</strong> Accept, deny, or submit
              counteroffers.
            </p>
          </div>
          <div className="flex items-start">
            <BsCalendar4 className="mr-2 text-primaryGreen" />
            <p className="text-sm text-gray-600">
              <strong>Inspect traveler details:</strong> Verify profiles before
              confirming bookings.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Perfect for hosts who prefer a hands-on approach to guest selection.
        </p>
      </div>
    </div>
  );
};