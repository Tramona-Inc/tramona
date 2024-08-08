/* eslint-disable @next/next/no-img-element */
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface BookingModificationEmailProps {
  userName: string;
  confirmationNumber: string;
  property: string;
  previousDates: { from: string; to: string };
  changedDates: { from: string; to: string };
}

export default function BookingModificationEmail({
  userName = "User",
  confirmationNumber = "ABC123456",
  property = "Property",
  previousDates = { from: "06-01-2024", to: "06-02-2024" },
  changedDates = { from: "06-03-2024", to: "06-04-2024" },
}: BookingModificationEmailProps) {
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
          Hi, there was a modification made to your booking {confirmationNumber}
        </Text>
        <Text className="mb-4 text-left">Hi {userName},</Text>
        <Text className="mb-4 text-left">
          There has been a change to your reservation:
        </Text>
        <Text className="m-0 p-0 text-left">Reservation:</Text>
        <Text className="m-0 p-0 text-left">{property}</Text>
        <Text className="m-0 mb-4 p-0 text-left">
          {previousDates.from} to {previousDates.to}
        </Text>
        <Text className="m-0 p-0 text-left">The change:</Text>
        <Text className="m-0 mb-4 p-0 text-left">
          {changedDates.from} to {changedDates.to}
        </Text>
        <Text className="mb-8 text-left">
          Please let us know if you have any questions or concerns regarding
          this change.
        </Text>
        <Button
          href="https://www.tramona.com/help-center"
          className="mx-auto mb-6 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
        >
          Contact
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