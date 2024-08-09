import { Layout, CustomButton } from "./EmailComponents";
import { Text } from "@react-email/components";

export default function VerifyEmailLink({
  name,
  url,
}: {
  name: string | null;
  url: string;
}) {
  return (
    <Layout title_preview="Verify Your Email">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left text-2xl font-bold">
            {name ? `Hi ${name},` : ""}
          </Text>
          <Text className="text-brand text-left">
            Please click on the following link to verify your email
          </Text>
          <Text className="text-muted">
            Please note that this link will expire in{" "}
            <strong>30 minutes</strong>.
          </Text>
        </div>
        <CustomButton link={url} title="Verify Email" />
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">Thanks,</Text>
          <Text className="text-brand text-left">
            <strong>Tramona Team</strong>
          </Text>
        </div>
      </div>
    </Layout>
  );
}
