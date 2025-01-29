/* eslint-disable @next/next/no-img-element */

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
    <Layout
      title_preview={`${name ?? email} invited you to their host team on Tramona`}
    >
      <div className="border-b border-gray-300 bg-white p-6 text-black">
        <div className="mb-4" style={{ display: "inline-block" }}>
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: "24px", verticalAlign: "middle" }}
          />
          <span
            className="ml-2 text-lg font-bold text-black"
            style={{ verticalAlign: "middle" }}
          >
            Tramona
          </span>
        </div>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <Text className="mb-4 text-center text-3xl font-bold">
          Host Team Invitation
        </Text>
        <Text className="mb-4 text-left">
          Hello,
          <br />
          {name ?? email} has invited you to join their host team on Tramona! To
          accept this invitation, please click the button below to sign up or
          login.
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <a
              href={inviteUrl}
              className="inline-block rounded bg-teal-900 px-4 py-2 font-bold text-white no-underline"
              style={{ textDecoration: "none" }}
            >
              Sign Up or Login
            </a>
          </div>
        </Text>

        <Text>
          If you have any questions about this invitation or need assistance,
          please don&apos;t hesitate to reach out to us.
        </Text>
        <Text>
          Best regards, <br />
          The Tramona Team
        </Text>
        <Text className="mb-6 mt-0 text-left">
          Questions? Send them to us directly at{" "}
          <a href="mailto:info@tramona.com" className="text-black no-underline">
            info@tramona.com
          </a>
        </Text>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <div style={{ paddingTop: "16px", overflow: "hidden" }}>
          <div style={{ float: "left" }}>
            <img
              src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
              alt="Tramona Logo"
              style={{ width: "32px" }}
            />
          </div>
          <div style={{ float: "right" }}>
            <a
              href="https://www.instagram.com/shoptramona/"
              style={{
                display: "inline-block",
                marginLeft: "16px",
                color: "black",
              }}
            >
              <img
                src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
                alt="Instagram Logo"
                style={{ width: "32px" }}
              />
            </a>
            <a
              href="https://www.facebook.com/ShopTramona"
              style={{
                display: "inline-block",
                marginLeft: "16px",
                color: "black",
              }}
            >
              <img
                src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
                alt="Facebook Logo"
                style={{ width: "32px" }}
              />
            </a>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    </Layout>
  );
}
//   return (
//     <Layout
//       title_preview={`${name ?? email} invited you to their host team on Tramona`}
//     >
//       <div className="pt-2" style={{ textAlign: "center" }}>
//         <div className="text-brand px-6 text-left text-base">
//           <Text className="text-brand text-left">
//             Hello, {name ?? email} invited you to their host team on Tramona!
//             Sign up or login at <Link href={inviteUrl}>{`${inviteUrl}`}</Link>{" "}
//             with this email to be added to the team.
//           </Text>
//         </div>
//       </div>
//     </Layout>
//   );
// }
