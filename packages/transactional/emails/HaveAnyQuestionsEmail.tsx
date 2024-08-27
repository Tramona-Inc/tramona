/* eslint-disable @next/next/no-img-element */

import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function HaveAnyQuestionsEmail({ name }: { name: string }) {
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
        <Text className="mb-4 text-center text-3xl font-bold">Case Study</Text>
        <Text className="mb-4 text-left">
          Dear {name},
          <br />
          We hope you&apos;re enjoying your experience with Tramona so far!
          It&apos;s been a week since you joined us, and we wanted to check in
          to see how everything&apos;s going.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          How Are You Finding Tramona?
        </Text>
        <Text className="mb-2 text-left">
          Is there anything we can do to make your experience better? Whether
          you have questions, feedback, or just want to share your thoughts,
          we&apos;re all ears. Your insights are invaluable to us as we continue
          to improve Tramona for everyone.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          We&apos;re Just an Email Away
        </Text>
        <Text>
          We&apos;re committed to making sure you get the most out of Tramona.
          Don&apos;t hesitate to get in touch—we&apos;re here to support you
          every step of the way.
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
