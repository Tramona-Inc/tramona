/* eslint-disable @next/next/no-img-element */

import { Text, Button, Html } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function HowToUseTramonaEmail() {
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
          How to use Tramona
        </Text>
        <Text className="mb-4 text-left">
          Welcome to Tramona! We&apos;re thrilled to have you on board. Whether
          you&apos;re here to find your next travel destination or to host
          travelers, we&apos;re here to make your experience smooth and
          enjoyable.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          Step 1: Make a Request
        </Text>
        <Html className="mb-4 text-left">
          <ul>
            <li>
              Log in to your Tramona account and navigate to the “Travel
              Requests” section.
            </li>
            <li>
              {" "}
              Fill in your travel details, including your desired destination,
              dates, and any specific preferences or requirements.
            </li>
            <li> Submit your request to start receiving potential matches. </li>
          </ul>
        </Html>
        <Text className="mb-2 text-left text-xl font-bold">
          Step 2: Review Your Matches
        </Text>
        <Html className="mb-4 text-left">
          <ul>
            <li>
              Once your request is submitted, you&apos;ll start receiving offers
              from various hosts.
            </li>
            <li>
              {" "}
              Review each host&apos;s profile carefully, including their
              location, amenities, and reviews from previous travelers.
            </li>
            <li>
              {" "}
              Fill in your travel details, including your desired destination,
              dates, and any specific preferences or requirements.
            </li>
            <li>
              {" "}
              If you find an offer that meets your needs, you can secure it by
              making a payment, which will create a match.
            </li>
          </ul>
        </Html>
        <Text className="mb-2 text-left text-xl font-bold">
          Step 3: Finalize Your Plans
        </Text>
        <Html className="mb-4 text-left">
          <ul>
            <li>
              Once you&apos;ve confirmed a match, feel free to reach out to the
              host or Tramona support if you have any questions or need
              assistance.
            </li>
            <li>
              Don&apos;t forget to leave a review after your stay to help other
              travelers in the community!
            </li>
          </ul>
        </Html>
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
