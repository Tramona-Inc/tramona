import { Section, Text, Img } from "@react-email/components";
import * as React from "react";
import { Layout, Header, Footer, SocialLinks, Info, BottomHr, CustomButton, EmailConfirmationCard } from './emailcomponents'

interface BookingConfirmationEmailProps {
  hostName?: string;
  hostImageUrl?: string;
  startDate?: string;
  endDate?: string;
  address?: string;
  description?: string;
  property_image?: string;
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[];
}

const PropDefaults: BookingConfirmationEmailProps = {
  description: "Private Cozy Clean, close to EVERYTHING",
  hostName: "John Doe", 
  hostImageUrl: "https://via.placeholder.com/150", 
  startDate: "Nov 6",
  endDate: "Nov 11, 2024", 
  address: "101 Street Planet Earth", 
  property_image: "https://via.placeholder.com/600x300",  
  steps: [],
  links: [],
};

export const BookingConfirmationEmail = ({
  steps = PropDefaults.steps,
  links = PropDefaults.links,
  description = PropDefaults.description,
  hostName = PropDefaults.hostName,
  hostImageUrl = PropDefaults.hostImageUrl,
  startDate = PropDefaults.startDate, 
  endDate = PropDefaults.endDate, 
  address = PropDefaults.address, 
  property_image = PropDefaults.property_image, 
}: BookingConfirmationEmailProps) => {
  return (
    <Layout title_preview="Booking confirmation/Payment received">
      <Header title="Booking Confirmation/Payment Received" />
      <Text className="text-left text-base px-6 text-brand">
        Hello (user). Your booking to (name of place) has been confirmed. Congrats and enjoy!
      </Text>
      <Section className="flex justify-center">
        <EmailConfirmationCard
          hostName={hostName}
          hostImageUrl={hostImageUrl}
          startDate={startDate}
          endDate={endDate}
          address={address}
        />
      </Section>
      <CustomButton link="https://www.tramona.com/" title="View trip detail"/>
      <Text className="text-left text-base px-6 text-brand">
         If there are any questions, send us an email at info@tramona.com or send the host a message directly.
      </Text>
      <BottomHr/>
      <SocialLinks />
      <Footer/>
      <Info/>
    </Layout>
  );
};

export default BookingConfirmationEmail;