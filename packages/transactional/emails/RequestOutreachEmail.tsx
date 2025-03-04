import {
  Container,
  Heading,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import {
  BottomHr,
  CustomButton,
  Footer,
  Info,
  Layout,
  SocialLinks,
} from "./EmailComponents";
import { formatDate } from "date-fns";

interface RequestOutreachEmailProps {
  requestLocation: string;
  requestAmount: number;
  numOfGuest: number;
  notes?: string;
  maximumPerNightAmount?: number;
  checkIn: Date;
  checkOut: Date;
  requestId: string;
}

export default function RequestOutreachEmail({
  requestLocation = "New York",
  requestAmount = 20000,
  numOfGuest = 3,
  notes,
  maximumPerNightAmount = 300,
  checkIn = new Date("October 26, 2024"),
  checkOut = new Date("October 27, 2024"),
  requestId = "168",
}: RequestOutreachEmailProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000";

  const fmtdDateRange = formatDateRange(checkIn, checkOut);

  return (
    <Layout
      title_preview={`New Booking Request for Your Property in ${requestLocation}`}
    >
      <Container style={container}>
        <Heading
          style={h1}
        >{`Tramona: New Booking Request for ${requestLocation}`}</Heading>
        {/* <Text style={text}>
          We have a new booking request for your property in{" "}
          <strong>{requestLocation}</strong>!
        </Text> */}
        <Section style={detailsContainer}>
          <Text style={detailsHeading}>Request Details:</Text>
          <Text style={detailsText}>
            <strong>Location:</strong> {requestLocation}
          </Text>
          <Text style={detailsText}>
            <strong>Dates:</strong> {fmtdDateRange}
          </Text>
          <Text style={detailsText}>
            <strong>Price per night:</strong>{" "}
            {maximumPerNightAmount
              ? formatCurrency(maximumPerNightAmount)
              : "N/A"}
          </Text>
          <Text style={detailsText}>
            <strong>Number of guests:</strong>{" "}
            {plural(numOfGuest, "guest")}
          </Text>
          <Text style={{ ...detailsText, ...totalBudgetStyle }}>
            <strong>Potential earnings for your empty night:</strong>{" "}
            {requestAmount ? formatCurrency(requestAmount) : "N/A"}
          </Text>
        </Section>
        {notes && (
          <Section style={notesContainer}>
            <Text style={notesHeading}>Additional Notes from Traveler:</Text>
            <Text style={notesText}>&apos;{notes}&apos;</Text>
          </Section>
        )}
        <Text
          style={{
            ...text,
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "left",
          }}
        >
          What is Tramona?
        </Text>
        <Text style={{ ...numberedListText, textAlign: "left" }}>
          1. Tramona is the only OTA built to supplement other booking channels,
          and fill your empty nights
        </Text>
        <Text style={{ ...numberedListText, textAlign: "left" }}>
          2. Tramona charges 5-10% less in fees so every booking puts more in
          your pocket
        </Text>
        <Text style={{ ...numberedListText, textAlign: "left" }}>
          3. All bookings come with $50,000 of protection.
        </Text>
        <Text style={{ ...numberedListText, textAlign: "left" }}>
          4. Sign up instantly, with our direct Airbnb connection. This auto
          connects your calendars, pricing, properties and anything else on
          Airbnb
        </Text>

        <CustomButton
          title="Log in now to review and accept this booking request"
          link={`${baseUrl}/request-preview/${requestId}`}
        />

        <Text style={{ ...text, textAlign: "center" }}>
          Not quite the booking you&apos;re looking for? No worries! We have
          travelers making requests every day.
        </Text>

        <Text style={{ ...helpText, fontWeight: "bold", marginTop: "24px" }}>
          Questions about this request?
        </Text>
        <Text style={helpText}>
          Email us at{" "}
          <Link href="mailto:info@tramona.com" style={link}>
            info@tramona.com
          </Link>
        </Text>
        <Text style={helpText}>
          Or schedule a quick call with our Host Support team:{" "}
          <Link href="https://calendly.com/tramona/call-with-tramona-team" style={link}>
            https://calendly.com/tramona/call-with-tramona-team
          </Link>
        </Text>
        {/* <Text style={{ ...helpText, marginBottom: "32px" }}>
          (Copy and paste this link to schedule a call)
        </Text> */}

        <BottomHr />
        {/* <Text style={{ textAlign: 'center', marginTop: '16px', color: '#6b7280' }}>[Tramona Logo (if you can include a simple text representation)]</Text> */}
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
  fontSize: "20px",
  textAlign: "left" as const,
  marginTop: "20px",
  fontWeight: "bold",
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
  textAlign: "left" as const,
  paddingLeft: "0px",
};

// Replace Placeholders in Props:

// hostDashboardLink prop: You must replace the placeholder value "[Link to Host Dashboard/Requests Page]" with the actual URL of your host dashboard requests page in your application where you use the RequestOutreachEmail component.

// calendlyLink prop: You must replace the placeholder value "[Your Calendly Link Here]" with your actual Calendly scheduling link in your application where you use the RequestOutreachEmail component.


// Verify SocialLinks and Footer Components:

// The social media links and footer information are handled by the imported SocialLinks and Footer components from ./EmailComponents. Double-check that the SocialLinks component in your EmailComponents.tsx file contains the correct Instagram and Facebook links for Tramona. Similarly, verify the Footer component content is up-to-date.
