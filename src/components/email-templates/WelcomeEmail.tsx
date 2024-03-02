import { Text } from "@react-email/components";

import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  CustomButton,
} from "./EmailComponents";
import React from "react";

export function TramonaWelcomeEmail() {
  return (
    <Layout title_preview="Welcome to Tramona">
      <Header title="Welcome to Tramona" />
      <div className="pt-2 pb-4" style={{ textAlign: "center" }}>
        <div className="bg-lightgrey inline-block w-11/12 mx-auto">
          <a
            href="https://www.tramona.com/"
            style={{ display: "block", width: "100%", margin: "0 auto" }}
          >
            <img
              src={
                "https://www.tramona.com/assets/images/email_images/welcome_email.png"
              }
              alt="Welcome Image"
              style={{ width: "100%", display: "block", margin: "0 auto" }}
            />
          </a>
          <Text className="text-4xl font-bold text-brand">3,200,000</Text>
          <Text className="text-sm text-brand">
            The number of empty units on Airbnb per night
          </Text>
        </div>
      </div>
      <CustomButton link="https://www.tramona.com/" title="Book now" />
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}

