/* eslint-disable @next/next/no-img-element */

import { Text, Html } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function CaseStudyEmail({ name }: { name: string }) {
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
        <Text className="mb-4 text-center text-3xl font-bold">Follow Up</Text>
        <Text className="mb-4 text-left">
          Dear {name},
          <br />
          We&apos;re excited to share some inspiring success stories from our
          Tramona community! 🌟
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">
          Real Success Stories
        </Text>
        <Text className="mb-2 text-left">
          Over the past few months, we&apos;ve seen incredible examples of how
          Tramona is making a real difference:
        </Text>
        <Html>
          <ul>
            <li>
              <b>Travelers Saving Money:</b> Meet Sarah, who discovered a
              charming, budget-friendly place through Tramona and enjoyed a
              memorable vacation without overspending. By using our platform,
              Sarah found the perfect stay that fit her budget and exceeded her
              expectations.
            </li>
            <li>
              <b>Hosts Lowering Vacancies:</b> John, a host in New York, saw a
              significant reduction in vacancy days thanks to Tramona. By
              connecting with travelers looking for unique accommodations,
              John&apso;s property is now consistently occupied, turning empty
              nights into opportunities.
            </li>
          </ul>
        </Html>
        <Text className="mb-2 text-left text-xl font-bold">
          Share Your Story
        </Text>
        <Text>
          Have you had a great experience with Tramona? We&apos;d love to hear
          from you! Share your travel stories and hosting experiences with us.
          Selected stories will be featured on our website, giving you a chance
          to be recognized and inspire others in the Tramona community.
        </Text>
        <Text className="mb-2 text-left text-xl font-bold">Stay Tuned</Text>
        <Text>
          We&apos;re committed to bringing you more success stories and helpful
          tips. Keep an eye on your inbox for our upcoming emails filled with
          real-life examples and insights on how to make the most of Tramona.
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
