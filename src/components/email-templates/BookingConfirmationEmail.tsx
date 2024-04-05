import React from "react";
import {
  Layout,
  Header,
  Footer,
  SocialLinks,
  Info,
  BottomHr,
  CustomButton,
  CustomButtonOutline,
  EmailConfirmationCard,
} from "./EmailComponents";
import {
  Text,
  Section,
  Hr,
  Row,
  Column,
  Container,
} from "@react-email/components";

interface BookingConfirmationEmailProps {
  userName?: string;
  placeName?: string;
  hostName?: string;
  hostImageUrl?: string;
  startDate?: string;
  endDate?: string;
  address?: string;
  propertyImageLink?: string;
  tripDetailLink?: string;
  originalPrice?: number;
  tramonaPrice?: number;
  tramonaDiscount?: number;
  offerDescription?: string;
  offerLink?: string;
  numOfNights?: number;
  paymentConfirmationDate?: string;
  tramonaServiceFee: number
}

export function BookingConfirmationEmail({
  userName = "User",
  placeName = "Tropical getaway in Mexico",
  hostName = "Host Name",
  hostImageUrl = "https://via.placeholder.com/150",
  startDate = "Nov 6",
  endDate = "Nov 11, 2024",
  address = "101 Street Planet Earth",
  propertyImageLink = "https://via.placeholder.com/600x300",
  tripDetailLink = "https://www.tramona.com/",
  originalPrice = 1000,
  tramonaPrice = 500,
  offerLink = "http://tramona/offers{offer.id}",
  numOfNights = 3,
  tramonaServiceFee = 0,
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
          hostName={hostName}
          hostImageUrl={hostImageUrl}
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
          <Text className="text-xs">Original Price</Text>
          </Column>
          <Column
            className="text-xs text-[#606060]"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column style={{ width: "100%" }}></Column>
          <Column
            style={{ paddingLeft: "150px", textAlign: "right" }}
          >{`$${originalPrice}`}</Column>
        </Row>
        <Row className="">
          <Column >
          <Text className="text-xs">Tramona's Price</Text>
          </Column>
          <Column
            className="text-xs text-[#606060]"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column style={{ paddingLeft: "150px" }}>{`$${tramonaPrice}`}</Column>
        </Row>
        <Row className="">
          <Column >
          <Text className="text-xs">Service Fee</Text>
          </Column>
          <Column
            className="text-xs text-white"
            style={{ paddingLeft: "5px" }}
          >
            x{numOfNights} nights
          </Column>
          <Column style={{ paddingLeft: "150px" }}>{`$${tramonaServiceFee}`}</Column>
        </Row>
        <Hr className="pt-5" />
        <Row className="font-bold">
          <Column>Total (USD)</Column>
          <Column className="text-right">{`$${tramonaPrice + tramonaServiceFee}`}</Column>
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
