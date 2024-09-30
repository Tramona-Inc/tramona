import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";
import Link from "next/link";

export default function HostTeamInviteEmail({
  email,
  name,
  cohostInviteId,
}: {
  email: string;
  name: string | null;
  cohostInviteId: string;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000";

  const inviteUrl = `${baseUrl}/cohost-invite/${cohostInviteId}`;
  return (
    <Layout title_preview="Tramona hostTeam invitation">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">
            Hello, {name ?? email} invited you to their host team on Tramona!
            Sign up at <Link href={inviteUrl}>{`${inviteUrl}`}</Link> with this email to be
            added to the team.
          </Text>
        </div>
      </div>
    </Layout>
  );
}
