/* eslint-disable @next/next/no-img-element */
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function WelcomeEmail({ name }: { name: string }) {
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
          Welcome to Tramona {name}!
        </Text>
        <Text className="mb-4 text-left">
          Hello, my name is Blake Singleton, Co-founder and CEO of Tramona.
          Thank you for helping us make traveling easier than ever before.
        </Text>
        <Text className="mb-4 text-left">
          Tramona was started with one goal in mind—allowing people to travel
          more for less, while cutting out fees in the process. (Did you know
          some of the bigger platforms charge around 20% per booking?) Every
          platform claims to give discounts, but after the fees, is it really a
          discount?
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          What is Tramona?
        </Text>
        <Text className="mb-4 text-left">
          Tramona is a one-of-a-kind booking platform. Every time you book it
          will be a truly unique booking deal you can’t find anywhere else, on
          the same properties, you see everywhere else.
        </Text>
        <Text className="mb-4 text-left">
          We have already allowed travelers to save <b>$250,000+</b> booking the
          same properties they find on other sites, on our site. Let&apos;s keep
          growing this number.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          How does it work?
        </Text>
        <Text className="mb-8 text-left">
          One of the biggest problems hosts face is vacancies due to market
          saturation, and as more people become hosts every day, the problem is
          worsening. This is where Tramona comes in. We allow travelers to
          submit an offer or a request. The host gets to match it, maximizing
          the dates booked hosts receive, while allowing travelers the chance to
          travel at lower prices. This makes Tramona the best place to book the
          best properties around the world.
        </Text>
        <Text className="m-0 text-left">Thanks,</Text>
        <Text className="m-0 text-left">Blake Singleton, CEO</Text>
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
