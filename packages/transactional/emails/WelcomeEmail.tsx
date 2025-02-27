import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface WelcomeEmailProps {
  name: string;
  referralCode: string;
}

export default function WelcomeEmail({ name, referralCode }: WelcomeEmailProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000";
  return (
    <Layout title_preview="Welcome to Tramona">
      <div
        style={{
          padding: "24px",
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: "24px" }}
          />
          <span
            style={{
              marginLeft: "8px",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            Tramona
          </span>
        </div>
        <hr
          style={{
            border: "none",
            borderBottom: "2px solid #e0e0e0",
            marginBottom: "24px",
          }}
        />

        {/* Welcome Message */}
        <Text
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Welcome to Tramona, {name}!
        </Text>
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Hi {name},<br /><br />
          Welcome to Tramona! We&apos;re excited to have you join a community of travelers
          discovering one-of-a-kind deals and finding new ways to travel more.
        </Text>
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Tramona is a unique platform designed to connect travelers directly with hosts,
          creating win-win opportunities for everyone. Whether you&apos;re looking for your
          next getaway or thinking about becoming a host yourself, Tramona offers
          something special.
        </Text>

        {/* Features List */}
        <Text
          style={{
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          As a traveler on Tramona, you can:
        </Text>
        <ul
          style={{
            marginLeft: "20px",
            marginBottom: "16px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          <li>
            <strong>Name Your Own Price &amp; Find Incredible Stays</strong>: Submit requests for your desired trips and get matched with hosts offering amazing deals on their properties. These opportunities are only available on Tramona.
          </li>
          <li>
            <strong>Travel Fee-Free with Friends</strong>: Introduce Tramona with your travel buddies and unlock fee-free bookings! For every friend you refer who signs up, you&apos;ll get your next booking completely fee-free. Travel more, pay less, together.
          </li>
          <li>
            <strong>Save Big on Your Travels</strong>: By connecting you directly with hosts that have empty nights, Tramona helps you save significantly on your getaways, while also increasing revenue to the hosts.
          </li>
        </ul>

        {/* Host Section */}
        <Text
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Thinking of becoming a host and filling your own empty nights?
        </Text>
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Tramona is also the only platform specifically built to help hosts like you fill
          those hard-to-book vacancies and maximize your earnings.{" "}
          <a
            href={`${baseUrl}/why-list`}
            style={{ color: "#000", textDecoration: "none", fontWeight: "bold" }}
          >
            Learn more about becoming a host
          </a>.
        </Text>

        {/* Call-to-Action */}
        <Text
          style={{
            marginBottom: "16px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Ready to start traveling more?
        </Text>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <Button
            href={`${baseUrl}?tab=search`}
            style={{
              padding: "12px 24px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            Make a request
          </Button>
        </div>

        {/* Referral Link Section */}
        <Text
          style={{
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Share the Travel Savings & Earn Fee-Free Bookings!
        </Text>
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Want to eliminate booking fees entirely? It&apos;s easy! Share your unique referral
          code with your friends and family who love to travel. For every person who signs
          up for Tramona through your link, you&apos;ll unlock a booking with zero traveler fees!
        </Text>
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Here&apos;s your unique referral code to share:{" "}
          <span style={{ fontWeight: "bold" }}>{referralCode}</span>
        </Text>

        {/* Help Section */}
        <Text style={{ marginBottom: "16px", fontSize: "16px", lineHeight: "1.5" }}>
          Have questions about exploring travel options or learning more about hosting? Visit
          our{" "}
          <a
            href={`${baseUrl}/help-center`}
            style={{ color: "#000", textDecoration: "none", fontWeight: "bold" }}
          >
            Help Center
          </a>{" "}
          or simply reply to this email, we&apos;re here to help you get started!
        </Text>

        {/* Footer */}
        <Text style={{ fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          Happy Travels (and Hosting!),<br />
          The Tramona Team<br />
          <a
            href={`${baseUrl}`}
            style={{ color: "#000", textDecoration: "none", fontWeight: "bold" }}
          >
            www.Tramona.com
          </a>
        </Text>
        <hr
          style={{
            border: "none",
            borderBottom: "2px solid #e0e0e0",
            marginBottom: "16px",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: "32px", marginRight: "16px" }}
          />
          <a
            href="https://www.instagram.com/shoptramona/"
            style={{ marginRight: "16px", display: "inline-block" }}
          >
            <img
              src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
              alt="Instagram"
              style={{ width: "32px" }}
            />
          </a>
          <a href="https://www.facebook.com/ShopTramona">
            <img
              src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
              alt="Facebook"
              style={{ width: "32px" }}
            />
          </a>
        </div>
      </div>
    </Layout>
  );
}
