import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";
import Link from "next/link";

export default function HostTeamInviteEmail({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000";
  return (
    <Layout title_preview="Tramona hostTeam invitation">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left">
            Hello, {name ?? email} invited you to their host team on Tramona!
            Sign up at <Link href={`${baseUrl}/auth/signup`}>https://tramona.com/auth/signup</Link> with this email to be
            added to the team.
          </Text>
        </div>
      </div>
    </Layout>
  );
}
