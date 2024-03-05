import { Layout, CustomButton } from "./EmailComponents";
import { Text } from "@react-email/components";

interface InvitedToRequestNotificationEmailProps {
  userName: string | null;
  signUpLink: string;
}

export function InvitedToRequestNotificationEmail({
  userName,
  signUpLink,
}: InvitedToRequestNotificationEmailProps) {
  return (
    <Layout title="You have been invited to a request on Tramona">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">
            {userName
              ? `${userName} invited you to their request on Tramona.`
              : "You have been invited to a request on Tramona."}
          </Text>
          <Text className="text-brand text-left">
            Sign up at Tramona to be added to the group!
          </Text>
          <CustomButton link={signUpLink} title="Sign Up" />
        </div>
      </div>
    </Layout>
  );
}
