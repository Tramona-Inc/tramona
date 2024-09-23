import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function HostTeamInviteEmail({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  return (
    <Layout title_preview="Tramona hostTeam invitation">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">
            Hello, {name ?? email} invited you to their host team on Tramona!
            Sign up at https://tramona.com/auth/signup with this email to be
            added to the team.
          </Text>
        </div>
      </div>
    </Layout>
  );
}
