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
import { Text, Section, Hr, Row, Column } from "@react-email/components";

interface BookingConfirmationEmailProps {
  name: string;
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
  tramonaServiceFee: number;
}

export default function BookingConfirmationEmail({
  name = "User",
  placeName = "Tropical getaway in Mexico",
  startDate = "Nov 6",
  endDate = "Nov 11, 2024",
  address = "101 street planet earth",
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
      <Text className="text-brand px-6 text-left text-base">
        Hello, {name}. Your booking to {placeName} has been confirmed. Congrats
        and enjoy!
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
        className="flex flex-col items-center justify-center px-6 pb-6 pt-6"
        style={{ width: "100%" }}
      >
        {/* <Row className="">
          <Column>
            <Text className="whitespace-no-wrap text-xs">Original Price</Text>
          </Column>
          <Column
            className="whitespace-no-wrap text-xs text-[#606060]"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column className="text-right" style={{ paddingLeft: "150px" }}>
            {formatCurrency(originalPrice)}
          </Column>
        </Row> */}
        <Row className="">
          <Column>
            <Text className="whitespace-no-wrap text-xs">
              Tramona&apos;s Price
            </Text>
          </Column>
          <Column
            className="whitespace-no-wrap text-xs text-[#606060]"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column style={{ paddingLeft: "150px" }}>
            {formatCurrency(tramonaPrice)}
          </Column>
        </Row>
        <Row className="">
          <Column>
            <Text className="text-xs">Service Fee</Text>
          </Column>
          <Column className="text-xs text-white" style={{ paddingLeft: "5px" }}>
            x{numOfNights} nights
          </Column>
          <Column className="text-end" style={{ paddingLeft: "150px" }}>
            {formatCurrency(tramonaServiceFee)}
          </Column>
        </Row>
        <Hr className="pt-5" />
        <Row className="font-bold">
          <Column>Total (USD)</Column>
          <Column className="text-right">
            {formatCurrency(tramonaPrice + tramonaServiceFee)}
          </Column>
        </Row>
      </Section>
      <Text className="text-brand px-6 text-left text-base">
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
