import { Section, Text, Link } from "@react-email/components";
import { Layout, CustomButton } from "./EmailComponents";

interface WelcomeHostEmailProps {
  userName: string;
  completeListingLink: string;
  referralLink: string; // Added referralLink prop
  helpCenterLink: string; // Added helpCenterLink prop
}

export default function WelcomeHostEmail({
  userName = "Host",
  completeListingLink = "https://www.tramona.com/complete-listing",
  referralLink = "[Your Unique Referral Link Here]", // Default referral link placeholder
  helpCenterLink = "[Link to Help Center]", // Default help center link placeholder
}: WelcomeHostEmailProps) {
  return (
    <Layout title_preview="Welcome to Tramona! Let's Turn Empty Nights into Bookings">
      <Text className="text-brand px-6 text-left text-base">
        Hi {userName},
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        Welcome to Tramona! We&apos;re thrilled to have you join our community
        of smart hosts who are maximizing their earnings and effortlessly
        filling those empty nights.
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        You&apos;ve taken the first step to truly unlocking the earning
        potential of your short-term rental. With Tramona, you can:
      </Text>

      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "20px", fontWeight: "bold" }}
      >
        Fill Your Empty & Hard-to-Book Nights:
      </Text>
      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "40px" }}
      >
        Stop leaving money on the table. Tramona is built to connect you with
        travelers specifically looking to book those vacancies.
      </Text>

      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "20px", fontWeight: "bold" }}
      >
        Enjoy Lower Fees & Higher Earnings:
      </Text>
      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "40px" }}
      >
        Keep more of your revenue with our industry-leading low host fees –
        5-10% lower than platforms like Airbnb.
      </Text>

      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "20px", fontWeight: "bold" }}
      >
        Get Peace of Mind with $50,000 Property Protection:
      </Text>
      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "40px" }}
      >
        All bookings through Tramona come with $50,000 in protection, and you
        can still utilize security deposits for added security.
      </Text>

      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "20px", fontWeight: "bold" }}
      >
        Effortlessly Sync with Airbnb:
      </Text>
      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "40px" }}
      >
        Connect your Airbnb account in minutes and automatically import your
        listings, calendars, pricing, photos, and more. No double bookings,
        guaranteed!
      </Text>

      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "20px", fontWeight: "bold" }}
      >
        Take Control with Host-Side Customization:
      </Text>
      <Text
        className="text-brand px-6 text-left text-base"
        style={{ marginLeft: "40px" }}
      >
        You have complete control over your listings and how you fill your
        vacancies.
      </Text>

      <Text className="text-brand mt-4 px-6 text-left text-base">
        Ready to get started? Click below to complete your listing and unlock
        the full potential of your property.
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <CustomButton link={completeListingLink} title="Complete My Listing" />
      </Section>

      <Text className="text-brand mt-8 px-6 text-left text-base font-bold">
        Help Tramona grow & Get Rewarded!
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        We believe in growing together! Know other hosts who could benefit from
        filling their empty nights and earning more? Refer them to Tramona, and
        for every host who signs up through your unique referral link,
        you&apos;ll get a fee-less booking on us! That&apos;s right, your next
        booking fee is waived as a thank you for helping us grow the Tramona
        community.
      </Text>
      <Text className="text-brand mt-2 px-6 text-left text-base">
        Here&apos;s your unique referral link to share:
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <Link href={referralLink} className="text-black no-underline">
          {referralLink}
        </Link>
      </Text>

      <Text className="text-brand mt-4 px-6 text-left text-base">
        Need help getting started or have questions? Our Host Support team is
        here for you. Visit our Help Center{" "}
        <Link href={helpCenterLink} className="text-black no-underline">
          [Link to Help Center]
        </Link>{" "}
        or email us at{" "}
        <Link
          href="mailto:info@tramona.com"
          className="text-black no-underline"
        >
          info@tramona.com
        </Link>
      </Text>

      <Text className="text-brand mt-8 px-6 text-left text-base">
        Happy Hosting,
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        The Tramona Team
      </Text>
      <Text className="text-brand px-6 text-left text-base">
        <Link
          href="https://www.Tramona.com"
          className="text-black no-underline"
        >
          www.Tramona.com
        </Link>
      </Text>
    </Layout>
  );
}

// What You Need to Change/Verify:

// Replace Placeholders in Props:

// referralLink prop: You must replace the placeholder value "[Your Unique Referral Link Here]" with the actual dynamically generated referral link for each host when you use this component.

// helpCenterLink prop: You must replace the placeholder value "[Link to Help Center]" with the actual URL of your Help Center page.

// completeListingLink prop: Verify that "https://www.tramona.com/complete-listing" is the correct link for hosts to complete their listings. If not, update this prop value accordingly.

// Styling:

// The code uses className="text-brand px-6 text-left text-base" for most text elements. You'll need to ensure that the text-brand class and other styles are defined in your email styling setup (likely within your EmailComponents or a global email stylesheet) to get the intended visual appearance. You might need to adjust the inline styles I've added (like marginLeft and fontWeight) if they don't fit your design.
