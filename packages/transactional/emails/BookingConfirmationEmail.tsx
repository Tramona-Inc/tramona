import React from "react";
import { formatCurrency, getPriceBreakdown } from "@/utils/utils";
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
  userName: string;
  placeName: string;
  // hostName: string;
  // hostImageUrl: string;
  startDate: Date;
  endDate: Date;
  address: string;
  propertyImageLink: string;
  tripDetailLink: string;
  // originalPrice: number;
  tramonaPrice: number;
  offerLink: string;
  numOfNights: number;
  serviceFee: number;
  receiptNumber: string;
  tramonaServiceFee? : number,
  paymentMethod: string,
  datePaid: string
  tax: number,
  totalPricePaid: number,
}

export default function BookingConfirmationEmail({
  userName = "User",
  placeName = "Tropical getaway in Mexico",
  startDate = new Date("Nov 6, 2023"),
  endDate = new Date("Nov 11, 2024"),
  address = "101 Street Planet Earth",
  propertyImageLink = "https://via.placeholder.com/600x300",
  tripDetailLink = "https://www.tramona.com/",
  // originalPrice = 1000,
  tramonaPrice = 500,
  offerLink = "http://tramona/offers{offer.id}",
  numOfNights = 3,
  serviceFee = 20,
  receiptNumber = "12345",
  tramonaServiceFee,
  paymentMethod = "Card",
  datePaid = "27-02",
  tax = 0,
  totalPricePaid = 0,
}: BookingConfirmationEmailProps) {
  return (
    <Layout title_preview="Booking confirmation/Payment received">
      <Header title="Booking confirmation/Payment received" />
      <Text className="text-brand px-6 text-left text-base">
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
      <CustomButton link={offerLink} title="View trip details" />
      <Section
        className="flex flex-col items-center justify-center px-6 pb-6 pt-6"
        style={{ width: "100%" }}
      >
        <Row className="">
          <Column className="">
            <Text className="my-0 mt-2 text-[#606060] pr-4">Amount Paid</Text>
            <Text className="my-1 mb-2">{formatCurrency(tramonaPrice)}</Text>
          </Column>
          <Column className="">
          <Text className="my-0 mt-2 text-[#606060] pr-8">Date Paid</Text>
          <Text className="my-1 mb-2">{datePaid}</Text>
          </Column>
          <Column className="">
          <Text className="my-0 mt-2 text-[#606060] pl-2">Payment Method</Text>
          <Text className="my-1 mb-2 pl-2">Card - {paymentMethod}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
          <Text>Charges Breakdown</Text>
          </Column>
        </Row>
        {/* <Row className="">
          <Column>
            <Text className="whitespace-no-wrap text-xs">Payment Method</Text>
          </Column>
          <Column
            className="whitespace-no-wrap text-xs text-[#606060]"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights 
          </Column>
          <Column className="text-right" style={{ paddingLeft: "150px" }}>
            {paymentMethod}
          </Column>
        </Row> */}
        <Row className="">
          <Column>
            <Text className="whitespace-no-wrap text-base">
            {formatCurrency(tramonaPrice/numOfNights)} x {numOfNights} nights
            </Text>
          </Column>
          <Column className="text-end" style={{ paddingLeft: "150px" }}>
            {formatCurrency(tramonaPrice)}
          </Column>
        </Row>
        <Row className="">
          <Column>
            <Text className="text-base">Service Fee</Text>
          </Column>
          {/* <Column className="text-xs text-white" style={{ paddingLeft: "5px" }}>
            x {numOfNights} nights
          </Column> */}
          <Column className="text-end" style={{ paddingLeft: "150px" }}>
            {formatCurrency(serviceFee ?? 0)}
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-base">Tax</Text>
          </Column>
          <Column className="text-end" style={{paddingLeft: "150px"}}>
          {formatCurrency(tax)}
          </Column>
        </Row>
        <Hr className="pt-5" />
        <Row className="font-bold">
          <Column>Total (USD)</Column>
          <Column className="text-right">
            {formatCurrency(totalPricePaid + serviceFee)}
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
