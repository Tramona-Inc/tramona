/* eslint-disable @next/next/no-img-element */
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface BookingCancellationEmailProps {
  userName: string;
  confirmationNumber: string;
  dateRange: string;
  property: string;
  reason: string;
  refund: number;
}

export default function BookingCancellationEmail({
  userName = "User",
  dateRange = "",
  property = "Property",
  reason = "Reason",
}: BookingCancellationEmailProps) {
  return (
    <Layout title_preview="Booking Modification">
      <div className="border-b border-gray-300 bg-white p-6">
        <div className="mb-4" style={{ display: "inline-block" }}>
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: "24px", verticalAlign: "middle" }}
          />
          <span
            className="ml-2 text-lg font-bold text-black"
            style={{ verticalAlign: "middle" }}
          >
            Tramona
          </span>
        </div>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <Text className="mb-8 text-left text-3xl">
          Your booking at {property} for {dateRange} has been canceled
        </Text>
        <Text className="mb-4 text-left">Hi {userName},</Text>
        <Text className="mb-4 text-left">
          Your booking for {property} for the dates of {dateRange} has been
          canceled for {reason}.
        </Text>
        <Text className="mb-4 text-left">
          (info if there will be a refund or not, depending on cancellation
          policy, display refund amount if there is)
        </Text>
        <Text className="mb-4 text-left">
          If you believe this is an error please immediately contact our support
          team and we will assist you.
        </Text>
        <Text className="m-0 p-0 text-left">Best,</Text>
        <Text className="m-0 mb-8 p-0 text-left">The Tramona Team</Text>
        <Button
          href="https://www.tramona.com/help-center"
          className="mx-auto mb-6 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
        >
          Contact Us
        </Button>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <div style={{ paddingTop: "16px", overflow: "hidden" }}>
          <div style={{ float: "left" }}>
            <img
              src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
              alt="Tramona Logo"
              style={{ width: "32px" }}
            />
          </div>
          <div style={{ float: "right" }}>
            <a
              href="https://www.instagram.com/shoptramona/"
              style={{
                display: "inline-block",
                marginLeft: "16px",
                color: "black",
              }}
            >
              <img
                src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
                alt="Tramona Logo"
                style={{ width: "32px" }}
              />
            </a>
            <a
              href="https://www.facebook.com/ShopTramona"
              style={{
                display: "inline-block",
                marginLeft: "16px",
                color: "black",
              }}
            >
              <img
                src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
                alt="Tramona Logo"
                style={{ width: "32px" }}
              />
            </a>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    </Layout>
  );
}
