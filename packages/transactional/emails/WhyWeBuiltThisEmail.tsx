/* eslint-disable @next/next/no-img-element */

import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function WhyWeBuiltThisEmail() {
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
          Why Tramona?
        </Text>
        <Text className="mb-4 text-left">
          Our mission is simple: to connect travelers with affordable options
          and help hosts reduce their vacancy days. We recognized that travelers
          often face high costs when booking accommodations, while hosts
          struggle with empty rooms or properties. Tramona was designed to solve
          both of these challenges.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          A Win-Win for Everyone
        </Text>
        <Text className="mb-2 text-left">
          For travelers, Tramona offers a range of affordable, comfortable
          options tailored to fit your budget. You get to explore new places
          without breaking the bank.
          <br />
        </Text>
        <Text>
          For hosts, Tramona ensures your property is occupied and generating
          income, even during off-peak times. By filling these vacancies, you
          can maximize your property&apos;s potential and avoid the hassle of
          managing empty spaces.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          Join Us on This Journey
        </Text>
        <Text>
          Whether you&apos;re here to explore new destinations or to welcome
          guests into your home, we&apos;re here to support you every step of
          the way. Together, we&apos;re making travel more affordable and
          efficient for everyone.
        </Text>
        <Text className="mt-2 text-left">
          Thank you for being a part of the Tramona community!
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
