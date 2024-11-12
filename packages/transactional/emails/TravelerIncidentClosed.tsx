/* eslint-disable @next/next/no-img-element */

import { Text, Html } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function TravelerIncidentClosed({
  travelerName,
  claimCloseLink,
}: {
  travelerName: string;
  claimCloseLink: string;
}) {
  return (
    <Layout title_preview="Incident Report Finalized">
      <div className="border-b border-gray-300 bg-white p-6 text-black">
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
        <Text className="mb-4 text-center text-3xl font-bold">
          Incident Report Finalized
        </Text>
        <Text className="mb-4 text-left">
          Dear {travelerName},
          <br />
          The incident report submitted by your host regarding your recent stay
          has now been finalized. You can view the details of the report by
          clicking the link below.
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <a
              href={claimCloseLink}
              className="inline-block rounded bg-teal-900 px-4 py-2 font-bold text-white no-underline"
              style={{ textDecoration: "none" }}
            >
              View Report Details
            </a>
          </div>
        </Text>

        <Text>
          If you have any further questions or wish to discuss the report,
          please reach out to us.
        </Text>
        <Text>
          Best regards, <br />
          The Tramona Team
        </Text>
        <Text className="mb-6 mt-0 text-left">
          Questions? Send them to us directly at{" "}
          <a href="mailto:info@tramona.com" className="text-black no-underline">
            info@tramona.com
          </a>
        </Text>
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
                alt="Instagram Logo"
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
                alt="Facebook Logo"
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
