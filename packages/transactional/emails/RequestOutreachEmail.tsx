import {
  Container,
  Heading,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { formatCurrency, plural } from "@/utils/utils";
import {
  BottomHr,
  CustomButton,
  Footer,
  Info,
  Layout,
  SocialLinks,
} from "./EmailComponents";

interface RequestOutreachEmailProps {
  requestLocation: string;
  requestAmount?: number;
  numOfGuest?: number;
  notes?: string;
  maximumPerNightAmount?: number;
}

export default function RequestOutreachEmail({
  requestLocation = "New York",
  requestAmount = 20000,
  numOfGuest = 3,
  notes,
  maximumPerNightAmount = 300,
}: RequestOutreachEmailProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000";

  return (
    <Layout
      title_preview={`Booking Request for Your Property in ${requestLocation}`}
    >
      <Container style={container}>
        <Heading style={h1}>New Booking Request</Heading>
        <Text style={{ ...text, fontWeight: "bold" }}>
          Booking request for your empty night!
        </Text>
        <Text style={text}>
          We have travelers seeking accommodations in{" "}
          <strong>{requestLocation}</strong> for their upcoming trip.
        </Text>
        <Section style={detailsContainer}>
          <Text style={detailsHeading}>Request Details:</Text>
          <Text style={detailsText}>
            <strong>Location:</strong> {requestLocation}
          </Text>
          <Text style={detailsText}>
            <strong>Price per night:</strong>{" "}
            {maximumPerNightAmount
              ? formatCurrency(maximumPerNightAmount)
              : "N/A"}
          </Text>
          <Text style={detailsText}>
            <strong>Number of guests:</strong> {numOfGuest}{" "}
            {plural(numOfGuest, "guest")}
          </Text>
          <Text style={{ ...detailsText, ...totalBudgetStyle }}>
            <strong>Potential earnings for this empty night:</strong>{" "}
            {requestAmount ? formatCurrency(requestAmount / 100) : "N/A"}
          </Text>
        </Section>
        {notes && (
          <Section style={notesContainer}>
            <Text style={notesHeading}>Additional Notes from Traveler:</Text>
            <Text style={notesText}>&apos;{notes}&apos;</Text>
          </Section>
        )}
        <Text style={text}>What is Tramona?</Text>
        <Text style={numberedListText}>
          1. Tramona is the only OTA built to fill your empty nights
        </Text>
        <Text style={numberedListText}>
          2. All bookings come with $50,000 of protection.
        </Text>
        <Text style={numberedListText}>
          3. Sign up instantly with our direct Airbnb connection.
        </Text>

        <Text style={signUpText}>
          If you want this booking, you need to sign up to claim it!
        </Text>

        <CustomButton
          title="Review Request & Accept Booking"
          link={`${baseUrl}/host/requests`}
        />
        <Text style={helpText}>
          If you have any questions, please email us at{" "}
          <Link href="mailto:info@tramona.com" style={link}>
            info@tramona.com
          </Link>
        </Text>
        <BottomHr />
        <SocialLinks />
        <Footer />
        <Info />
      </Container>
    </Layout>
  );
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.1",
  margin: "40px 0 0",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const detailsContainer = {
  background: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const detailsHeading = {
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const detailsText = {
  margin: "8px 0",
};

const totalBudgetStyle = {
  fontSize: "20px", // Make it bigger
  textAlign: "center" as const, // Center align
  marginTop: "20px", // Add some spacing
  fontWeight: "bold", // Make it stand out
};

const notesContainer = {
  borderLeft: "4px solid #e5e7eb",
  padding: "12px 24px",
  margin: "24px 0",
};

const notesHeading = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px",
};

const notesText = {
  fontStyle: "italic",
  margin: "0",
};

const helpText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#5046e4",
  textDecoration: "underline",
};

const numberedListText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
  textAlign: "left" as const, // or center if you prefer
  paddingLeft: "20px", // Indent slightly for list appearance
};

const signUpText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
  fontWeight: "bold", // Make it stand out
};