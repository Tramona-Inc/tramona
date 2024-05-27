import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function GroupInviteEmail({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  return (
    <Layout title_preview="Tramona group invitation">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left text-2xl font-bold">
            {name ? `Hi ${name},` : ""}
          </Text>
          <Text className="text-brand text-left">
            {name ?? email} invited you to their request on Tramona! Sign up at
            https://tramona.com/auth/signup with this email to be added to the
            group.
          </Text>
        </div>
      </div>
    </Layout>
  );
}
