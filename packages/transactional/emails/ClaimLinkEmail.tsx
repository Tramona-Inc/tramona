/* eslint-disable @next/next/no-img-element */

import { Text, Html } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function ClaimLinkEmail({
  hostName,
  claimLink,
}: {
  hostName: string;
  claimLink: string;
}) {
  return (
    <Layout title_preview="Welcome to Tramona">
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
          Complete Incident Report{" "}
        </Text>
        <Text className="mb-4 text-left">
          Dear {hostName},
          <br />
          We have received your incident report. To complete your report, please
          click the button below to submit your evidence and provide more
          details.
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <a
              href={claimLink}
              className="inline-block rounded bg-teal-900 px-4 py-2 font-bold text-white no-underline"
              style={{ textDecoration: "none" }}
            >
              Submit Your Evidence
            </a>
          </div>
        </Text>

        <Text>Thank you for being a valued part of the Tramona family!</Text>
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
