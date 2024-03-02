import React from "react";
import { Layout, Header, Footer, SocialLinks, Info, BottomHr, CustomButton } from "./EmailComponents";
import { Text } from "@react-email/components";

export default function PasswordResetEmailLink({
  name,
  url,
}: {
  name: string | null;
  url: string;
}) {
  return (
    <Layout title_preview="Reset Your Password">
      <Header title="Reset Your Password" />
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-left text-base px-6 text-brand">
          <Text className="text-4xl font-bold text-left text-brand">{name ? `Hi ${name},` : ''}</Text>
          <Text className="text-brand text-left">Please click on the following link to reset your password</Text>
          <Text className="text-brand">
            <i>
              Please note that this link will expire in <strong>30 mins</strong>.
            </i>
          </Text>
        </div>
        <CustomButton link={url} title="Reset Password" />
        <div className="text-left text-base px-6 text-brand">
        <Text className="text-brand text-left">
        If you did not request this, please ignore this email and your password will remain unchanged.
        </Text>
        <Text className="text-brand text-left">Thanks,</Text>
        <Text className="text-brand text-left"><strong>Tramona Team</strong></Text>
        </div>
      </div>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}