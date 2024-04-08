import React from "react";
import { formatCurrency } from "@/utils/utils";
import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  CustomButton,
  EmailConfirmationCard,
} from "./EmailComponentsWithoutHost";
import {
  Text,
  Section,
  Hr,
  Row,
  Column,
  Container,
} from "@react-email/components";

interface BookingConfirmationEmailProps {
  userName: string;
  placeName: string;
  hostName: string;
  hostImageUrl: string;
  startDate: string;
  endDate: string;
  address: string;
  propertyImageLink: string;
  tripDetailLink: string;
  originalPrice: number;
  tramonaPrice: number;
  offerLink: string;
  numOfNights: number;
  tramonaServiceFee: number
}

export function BookingConfirmationEmail({
  userName = "User",
  placeName = "Tropical getaway in Mexico",
  startDate = "Nov 6",
  endDate = "Nov 11, 2024",
  address = "101 Street Planet Earth",
  propertyImageLink = "https://via.placeholder.com/600x300",
  tripDetailLink = "https://www.tramona.com/",
  originalPrice = 1000,
  tramonaPrice = 500,
  offerLink = "http://tramona/offers{offer.id}",
  numOfNights = 3,
  tramonaServiceFee,
}: BookingConfirmationEmailProps) {
  return (
    <Layout title_preview="Booking confirmation/Payment received">
      <Header title="Booking confirmation/Payment received" />
      <Text className="text-left text-base px-6 text-brand">
        Hello, {userName}. Your booking to {placeName} has been confirmed.
        Congrats and enjoy!
      </Text>
      <Section
        className="flex justify-center px-6 pb-6"
        style={{ width: "100%" }}
      >
        <EmailConfirmationCard
          startDate={startDate}
          endDate={endDate}
          address={address}
          placeName={placeName}
          property_image_link={propertyImageLink}
          confirmation_link={tripDetailLink}
        />
      </Section>
      <CustomButton link={offerLink} title="View trip detail" />
      <Section
        className="flex flex-col justify-center items-center px-6 pb-6 pt-6"
        style={{ width: "100%" }}
      >
        <Row className="">
          <Column>
            <Text className="text-xs whitespace-no-wrap">Original Price</Text>
          </Column>
          <Column
            className="text-xs text-[#606060] whitespace-no-wrap"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column className="text-right" style={{ paddingLeft: "150px" }}>{formatCurrency(originalPrice)}</Column>
        </Row>
        <Row className="">
          <Column>
            <Text className="text-xs whitespace-no-wrap">Tramona's Price</Text>
          </Column>
          <Column
            className="text-xs text-[#606060] whitespace-no-wrap"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column style={{ paddingLeft: "150px" }}>{formatCurrency(tramonaPrice)}</Column>
        </Row>
        <Row className="">
          <Column>
            <Text className="text-xs">Service Fee</Text>
          </Column>
          <Column className="text-xs text-white" style={{ paddingLeft: "5px" }}>
            x{numOfNights} nights
          </Column>
          <Column className="text-end" style={{ paddingLeft: "150px" }}>{formatCurrency(tramonaServiceFee)}</Column>
        </Row>
        <Hr className="pt-5" />
        <Row className="font-bold">
          <Column>Total (USD)</Column>
          <Column className="text-right">{formatCurrency(tramonaPrice+tramonaServiceFee)}</Column>
        </Row>
      </Section>
      <Text className="text-left text-base px-6 text-brand">
        If there are any questions, send us an email at info@tramona.com or send
        the host a message directly.
      </Text>
      <BottomHr />
      <SocialLinks />
      <Footer />
      <Info />
    </Layout>
  );
}

export default BookingConfirmationEmail;
