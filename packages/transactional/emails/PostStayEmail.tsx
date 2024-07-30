/* eslint-disable @next/next/no-img-element */
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface PostStayEmailProps {
  userName: string;
  property: string;
  house: string;
}

export default function PostStayEmail({
  userName = "User",
  property = "Property",
  house = "House",
}: PostStayEmailProps) {
  return (
    <Layout title_preview="Post stay feedback">
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
          How was you recent stay at {property}?
        </Text>
        <Text className="mb-4 text-left">Hi {userName},</Text>
        <Text className="mb-4 text-left">
          We hope you had a great time at {house} and hope that you make it home
          safely. 
        </Text>
        <Text className="mb-4 text-left">
          How was your stay with us? It would help us out a lot if you left a
          review. I put the link at the bottom of this email so it’s easy to get
          to. Any feedback you have is greatly appreciated.
        </Text>
        <Text className="mb-4 text-left">
          We wanted to thank you again for letting us be part of your vacation
          experience. Safe travels and hope to hear from you soon!
        </Text>
        <Text className="m-0 p-0 text-left">Best,</Text>
        <Text className="m-0 mb-8 p-0 text-left">Tramona Team</Text>
        <Button
          href="https://www.tramona.com/my-trips"
          className="mx-auto mb-6 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
        >
          Leave a Review
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
