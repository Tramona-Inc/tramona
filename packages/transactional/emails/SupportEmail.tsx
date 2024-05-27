import { Text } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function SupportEmail({
  email,
  name,
  message,
}: {
  email: string;
  name: string | null;
  message: string;
}) {
  return (
    <Layout title_preview="Support Email">
      <div className="pt-2" style={{ textAlign: "center" }}>
        <div className="text-brand px-6 text-left text-base">
          <Text className="text-brand text-left text-2xl font-bold">
            {email ? `Request from ${email},` : ""} {name}
          </Text>
          <Text className="text-brand text-left">{message}</Text>
        </div>
      </div>
    </Layout>
  );
}
