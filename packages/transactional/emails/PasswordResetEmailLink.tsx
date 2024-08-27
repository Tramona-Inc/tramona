import { Layout, CustomButton } from "./EmailComponents";
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
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          {name && (
            <Text className="text-brand text-left text-4xl font-bold">
              Hi {name},
            </Text>
          )}
          <Text className="text-brand text-left">
            Please click on the following link to reset your password
          </Text>
          <Text className="text-muted">
            Please note that this link will expire in{" "}
            <strong>30 minutes</strong>.
          </Text>
        </div>
        <CustomButton link={url} title="Reset Password" />
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">
            If you did not request this, please ignore this email and your
            password will remain unchanged.
          </Text>
          <Text className="text-brand text-left">Thanks,</Text>
          <Text className="text-brand text-left">
            <strong>Tramona Team</strong>
          </Text>
        </div>
      </div>
    </Layout>
  );
}
