import { Text } from "@react-email/components";

import { Layout, Header, CustomButton } from "./EmailComponents";

export function TramonaWelcomeEmail() {
  return (
    <Layout title_preview="Welcome to Tramona">
      <Header title="Welcome to Tramona" />
      <div className="pb-4 pt-2" style={{ textAlign: "center" }}>
        <div className="bg-lightgrey mx-auto inline-block w-11/12">
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
          <Text className="text-brand text-4xl font-bold">3,200,000</Text>
          <Text className="text-brand text-sm">
            The number of empty units on Airbnb per night
          </Text>
        </div>
      </div>
      <CustomButton link="https://www.tramona.com/" title="Book now" />
    </Layout>
  );
}
