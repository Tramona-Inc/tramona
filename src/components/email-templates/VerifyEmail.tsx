import React from "react";
import { Layout, Header, Footer, SocialLinks, Info, BottomHr, CustomButton } from "./EmailComponents";
import { Text } from "@react-email/components";

export function VerifyEmailLink({
  name,
  url,
}: {
  name: string | null;
  url: string;
}) {
  return (
    <Layout title_preview="Verify Your Email">
      <Header title="Verify Your Email" />
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="inline-block w-11/12 mx-auto">
          <Text className="text-4xl font-bold text-left text-brand">{name ? `Hi ${name},` : ''}</Text>
          <Text className="text-left text-brand">Please click on the following link to verify your email</Text>
          <Text className="text-brand">
            <i>
              Please note that this link will expire in <strong>30 mins</strong>.
            </i>
          </Text>
          </div>
          <CustomButton link={url} title="Verify Email" />
          <div className="inline-block w-11/12 mx-auto">
          <Text className="text-left text-brand">
            If you did not request this, please ignore this email and your password will remain unchanged.
          </Text>
          <Text className="text-left text-brand">Thanks,</Text>
          <Text className="text-left text-brand"><strong>Tramona Team</strong></Text>
        </div>
      </div>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}
