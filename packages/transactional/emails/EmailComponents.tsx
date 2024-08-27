/* eslint-disable @next/next/no-img-element */
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Hr,
} from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title_preview: string;
}

interface HeaderProps {
  title: string;
}

interface ButtonProps {
  title: string;
  link: string;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface EmailOfferCardProps {
  originalPrice?: number;
  tramonaPrice?: number;
  description?: string;
  property_image_link?: string;
  countdown: Countdown;
  offer_link: string;
}

interface BookingCardProps {
  checkIn?: string;
  checkOut?: string;
  originalPrice?: number;
  tramonaPrice?: number;
  description?: string;
  property_image_link?: string;
  isExpired: boolean;
  booking_link?: string;
}

interface EmailConfirmationCardProps {
  hostName?: string;
  hostImageUrl?: string;
  startDate?: string;
  endDate?: string;
  address?: string;
  placeName?: string;
  property_image_link?: string;
  confirmation_link?: string;
}

export const TramonaLogo = () => {
  return (
    <div className="text-brand flex items-center gap-2 bg-white text-lg font-bold">
      <img
        src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
        alt="Tramona Logo"
        style={{ width: "auto", height: "24px", marginRight: "5px" }}
      />
      Tramona
    </div>
  );
};
const main = {
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  background: "#FFFFF",
};

export const Layout: React.FC<LayoutProps> = ({ children, title_preview }) => {
  return (
    <Html>
      <Preview className="text-[#333333]">{title_preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#333333",
                primaryGreen: "#134E4A",
                muted: "#737373",
                offwhite: "#fafbfb",
                grey: "#4D4D4D",
                lightgrey: "#F9F9F9",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Head />
        <Body
          className="font-sans flex items-center justify-center text-base text-black"
          style={main}
        >
          <Container className="bg-white" style={{ backgroundColor: "white" }}>
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <div className="ml-6 mt-4">
        <TramonaLogo />
      </div>
      <div className="inline-flex w-full items-center justify-center">
        <Hr className="h-px w-11/12 border-0 bg-gray-400" />
      </div>
      <Heading className="my-0 ml-6 mt-4 text-left text-lg leading-8">
        <strong className="text-brand">{title}</strong>
      </Heading>
    </>
  );
};

export const BottomHr = () => {
  return (
    <div className="inline-flex w-full items-center justify-center">
      <Hr className="mt-8 h-px w-11/12 border-0 bg-gray-400" />
    </div>
  );
};

export const Info = () => {
  return (
    <div className="pb-6">
      <div className="text-left font-light">
        <Text className="text-brand mx-6 text-xs font-light">
          Update your email preferences to choose which emails you get or
          unsubscribe from this type of email.
        </Text>
      </div>
      <Row>
        <Column className="px-20 text-center">
          {/* <Link className="text-grey text-xs mr-2">Unsubscribe</Link> */}
          {/* <Link className="text-grey text-xs underline">View in the browser</Link> */}
        </Column>
      </Row>
    </div>
  );
};

export const CustomButton: React.FC<ButtonProps> = ({ title, link }) => {
  return (
    <Section className="text-center">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto inline-block w-11/12 whitespace-nowrap rounded-full bg-primaryGreen px-3 py-3 text-base font-semibold text-white"
        style={{
          textDecoration: "none",
        }}
      >
        {title}
      </a>
    </Section>
  );
};
export const CustomButtonOutline: React.FC<ButtonProps> = ({ title, link }) => {
  return (
    <Section className="text-center">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="border-brand text-brand mx-auto inline-block w-11/12 whitespace-nowrap rounded-full bg-white px-5 py-3 text-base font-semibold"
        style={{
          textDecoration: "none",
        }}
      >
        {title}
      </a>
    </Section>
  );
};

export const Footer = () => {
  return (
    <Row>
      <Column className="mb-0 mt-2">
        <Text className="mb-0 ml-6 text-left text-xs text-black">Tramona</Text>
        <Text className="ml-6 mt-0 text-left text-xs text-black">
          2314 236th AVE NE Sammamish WA 98074
        </Text>
      </Column>
    </Row>
  );
};

export const SocialLinks: React.FC = () => {
  return (
    <>
      <div className="mt-4 px-6">
        <table width="100%">
          <tr>
            <td style={{ textAlign: "left" }}>
              <a
                href="https://www.tramona.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
                  alt="Tramona Logo"
                  style={{ height: "16px" }}
                />
              </a>
            </td>
            <td style={{ textAlign: "right" }}>
              <div>
                <a
                  href="https://www.facebook.com/ShopTramona"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
                    alt="Facebook"
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "10px",
                    }}
                  />
                </a>
                <a
                  href="https://www.instagram.com/shoptramona/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
                    alt="Instagram"
                    style={{ width: "16px", height: "16px" }}
                  />
                </a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export const EmailOfferCard: React.FC<EmailOfferCardProps> = ({
  originalPrice,
  tramonaPrice,
  description,
  property_image_link,
  countdown,
  offer_link,
}) => {
  let discountPercentage = 0;
  if (tramonaPrice) {
    discountPercentage = originalPrice
      ? Math.round(((originalPrice - tramonaPrice) / originalPrice) * 100)
      : 0;
  }

  return (
    <table
      style={{
        width: "100%",
        border: "none",
        padding: "0",
        backgroundColor: "#f3f3f3",
      }}
      cellSpacing="0"
      cellPadding="0"
    >
      <tr>
        <td>
          <table
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              margin: "15px",
              padding: "0",
            }}
            cellSpacing="0"
            cellPadding="0"
          >
            <tr>
              <td>
                <a
                  href={offer_link}
                  style={{ borderRadius: "8px 8px 0 0", display: "block" }}
                >
                  <img
                    src={property_image_link}
                    alt="Offer Image"
                    style={{
                      width: "100%",
                      borderRadius: "8px 8px 0 0",
                      display: "block",
                      border: "none",
                    }}
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  fontSize: "base",
                  fontWeight: "bold",
                  paddingTop: "4px",
                  paddingLeft: "10px",
                  paddingRight: "6px",
                  textAlign: "left",
                  color: "#000000",
                }}
              >
                {description}
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: "6px", paddingRight: "6px" }}>
                <table style={{ width: "100%", border: "none" }}>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#a0a0a0",
                          textDecoration: "line-through",
                        }}
                      >
                        ${originalPrice}
                      </span>
                      <br />
                      <span style={{ fontSize: "small", color: "#a0a0a0" }}>
                        Airbnb price
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#000000",
                        }}
                      >
                        ${tramonaPrice}
                      </span>
                      <br />
                      <span style={{ fontSize: "small", color: "#a0a0a0" }}>
                        Our price
                      </span>
                    </td>
                    <td
                      style={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        textAlign: "center",
                        padding: "3px",
                      }}
                    >
                      <span style={{ fontSize: "large", fontWeight: "bold" }}>
                        {discountPercentage}% OFF
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table
                  style={{
                    width: "100%",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderRadius: "0 0 8px 8px",
                    marginTop: "10px",
                  }}
                >
                  <tr>
                    <td style={{ textAlign: "center", padding: "0px" }}>
                      <table style={{ margin: "auto" }}>
                        <tr>
                          <td style={{ textAlign: "center", padding: "0 4px" }}>
                            <span
                              style={{ fontWeight: "bold", fontSize: "18px" }}
                            >
                              {countdown.days.toString().padStart(2, "0")}
                            </span>
                            <br />
                            <span style={{ fontSize: "small" }}>Days</span>
                          </td>
                          <td style={{ textAlign: "center", padding: "0 4px" }}>
                            <span
                              style={{ fontWeight: "bold", fontSize: "18px" }}
                            >
                              {countdown.hours.toString().padStart(2, "0")}
                            </span>
                            <br />
                            <span style={{ fontSize: "small" }}>Hours</span>
                          </td>
                          <td style={{ textAlign: "center", padding: "0 4px" }}>
                            <span
                              style={{ fontWeight: "bold", fontSize: "18px" }}
                            >
                              {countdown.minutes.toString().padStart(2, "0")}
                            </span>
                            <br />
                            <span style={{ fontSize: "small" }}>Minutes</span>
                          </td>
                          <td style={{ textAlign: "center", padding: "0 4px" }}>
                            <span
                              style={{ fontWeight: "bold", fontSize: "18px" }}
                            >
                              {countdown.seconds.toString().padStart(2, "0")}
                            </span>
                            <br />
                            <span style={{ fontSize: "small" }}>Seconds</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

export const EmailConfirmationCard: React.FC<EmailConfirmationCardProps> = ({
  hostName,
  hostImageUrl,
  startDate,
  endDate,
  address,
  placeName,
  property_image_link,
  confirmation_link,
}) => {
  return (
    <table
      style={{
        width: "100%",
        border: "none",
        padding: "0",
        backgroundColor: "#f3f3f3",
      }}
      cellPadding="0"
      cellSpacing="0"
    >
      <tr>
        <td>
          <table
            style={{
              margin: "15px",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
            }}
            cellPadding="0"
            cellSpacing="0"
          >
            <tr>
              <td style={{ padding: "0" }}>
                <a
                  href={confirmation_link}
                  style={{ borderRadius: "8px 8px 0 0", display: "block" }}
                >
                  <img
                    src={property_image_link}
                    alt="Place Image"
                    style={{
                      width: "100%",
                      borderRadius: "8px 8px 0 0",
                      display: "block",
                      border: "none",
                    }}
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0 15px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#000000",
                    margin: "0",
                    paddingTop: "15px",
                  }}
                >
                  {placeName}
                </h2>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "15px 15px 0 15px", verticalAlign: "top" }}>
                <table style={{ border: "none" }}>
                  <tr>
                    <td style={{ padding: "0", width: "50px" }}>
                      <a
                        href="https://www.tramona.com/"
                        style={{ borderRadius: "50%", display: "block" }}
                      >
                        <img
                          src={
                            hostImageUrl ?? "https://via.placeholder.com/150"
                          }
                          alt="Host"
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            display: "block",
                            border: "none",
                          }}
                        />
                      </a>
                    </td>
                    <td style={{ padding: "0 0 0 8px" }}>
                      <p
                        style={{
                          color: "#606060",
                          margin: "0",
                          fontSize: "14px",
                        }}
                      >
                        Hosted by {hostName}
                      </p>
                      <p
                        style={{
                          color: "#787878",
                          margin: "0",
                          fontSize: "14px",
                          marginTop: "5px",
                        }}
                      >
                        +1 234 567 8901
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "15px" }}>
                <hr style={{ margin: "0" }} />
              </td>
            </tr>
            <tr>
              <td style={{ padding: "0 15px 15px 15px" }}>
                <p style={{ color: "#707070", margin: "0", fontSize: "14px" }}>
                  {startDate} - {endDate}
                </p>
                <p
                  style={{
                    color: "#707070",
                    margin: "0",
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {address}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};

export const BookingCard: React.FC<BookingCardProps> = ({
  checkIn,
  checkOut,
  description,
  property_image_link,
  isExpired,
  booking_link,
}) => {
  return (
    <table
      style={{
        width: "100%",
        border: "none",
        padding: "15px",
        backgroundColor: "#f3f3f3",
      }}
      cellPadding="0"
      cellSpacing="0"
    >
      <tr>
        <td
          style={{
            margin: "2px",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#ffffff",
          }}
        >
          <table
            style={{ width: "100%", border: "none" }}
            cellPadding="0"
            cellSpacing="0"
          >
            <tr>
              {isExpired && (
                <div
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "8px 0",
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    zIndex: "2",
                  }}
                >
                  Offer Expired
                </div>
              )}
            </tr>
            <tr>
              <td style={{ padding: "0" }}>
                <a
                  href={booking_link}
                  style={{
                    display: "inline-block",
                    width: "100%",
                    lineHeight: "0",
                  }}
                >
                  <img
                    src={property_image_link}
                    alt="Offer Image"
                    style={{ width: "100%", display: "block", border: "0" }}
                  />
                </a>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  marginLeft: "4px",
                  paddingLeft: "15px",
                  paddingBottom: "10px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    margin: "4px 0",
                    color: "#000000",
                  }}
                >
                  {description}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    margin: "4px 0",
                    color: "#000000",
                  }}
                >
                  {checkIn} - {checkOut}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  );
};
