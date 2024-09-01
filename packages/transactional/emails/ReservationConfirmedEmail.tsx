/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Text } from "@react-email/components";
import {
  BottomHr,
  CustomButton,
  Footer,
  Info,
  Layout,
  SocialLinks,
} from "./EmailComponents";

import { formatCurrency } from "@/utils/utils";
interface ReservationConfirmedEmailProps {
  userName: string;
  address: string;
  propertyName: string;
  propertyImageLink: string;
  hostName: string;
  //hostImageUrl: string;
  adults: number | string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  tramonaPrice: number;
  serviceFee: number;
  totalPrice: number;
  tripDetailLink: string;
  numOfNights: number;
}

export default function ReservationConfirmedEmail({
  userName = "John Doe",
  propertyName = "New Beach house with Sandy Backyard Fire Ring",
  propertyImageLink = "https://via.placeholder.com/600x300",
  hostName = "Pam",
  //hostImageUrl = "https://via.placeholder.com/150",
  adults = 2,
  checkInDate = "",
  checkOutDate = "",
  checkInTime = "1",
  checkOutTime = "1",
  address = "101 street planet earth",
  tramonaPrice = 150,
  serviceFee = 20,
  totalPrice = 20,
  tripDetailLink = "",
  numOfNights = 1,
}: ReservationConfirmedEmailProps) {
  return (
    <Layout title_preview="Reservation Confirmed">
      <div className="border-b border-gray-300 bg-white p-6 text-black">
        <Text className="mb-4 text-3xl font-bold text-black">
          Your Booking is Confirmed
        </Text>
        <Text className="mb-4 text-left">
          Hello, {userName}. Your booking to{" "}
          <span className="text-black-600 underline">{propertyName}</span> has
          been confirmed. Congrats and enjoy!
        </Text>
        <table
          className="mb-8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <tr>
            <td style={{ padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td
                    style={{
                      padding: 0,
                      background: propertyImageLink,
                      backgroundSize: "cover",
                      borderRadius: "8px",
                    }}
                  >
                    <a
                      href={tripDetailLink}
                      style={{ borderRadius: "8px 8px 0 0", display: "block" }}
                    >
                      <img
                        src={propertyImageLink}
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
              </table>
            </td>
          </tr>
        </table>
        <Text className="mb-4 text-2xl font-bold">{propertyName}</Text>
        <div style={{ display: "table", width: "100%", marginBottom: "16px" }}>
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
              width: "10%",
              paddingRight: "8px",
            }}
          >
            {/* <img
              src={hostImageUrl}
              alt="Host"
              className="h-10 w-10 rounded-full"
            /> */}
          </div>
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
              width: "20%",
            }}
          >
            <Text className="m-0 text-left text-sm">Hosted by</Text>
            <Text className="m-0 text-lg font-bold">{hostName}</Text>
          </div>
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
              textAlign: "right",
              width: "70%",
            }}
          >
            <a
              href="#"
              className="rounded-md bg-gray-200 px-4 py-2 text-black"
              style={{ textDecoration: "none", marginRight: "8px" }}
            >
              Message your host
            </a>
          </div>
        </div>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="m-0 text-xl font-bold">Your Trip</Text>
            <Text className="mt-1 text-left font-light capitalize">
              {address}
            </Text>
            <Text className="mt-0 text-left font-bold">
              {numOfNights} nights • {adults} Adults
            </Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text
              className="p-2 text-sm text-green-600"
              style={{ border: "1px solid #F2F1EF", borderRadius: "20px" }}
            >
              Booking confirmed
            </Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div className="mb-4" style={{ display: "table", width: "100%" }}>
          <div
            style={{ display: "table-cell", textAlign: "left", width: "50%" }}
          >
            <Text className="m-0 text-sm font-bold">Check-in</Text>
            <Text className="m-0 text-lg font-bold">{checkInDate}</Text>
            <Text className="mt-0 text-sm font-bold">{checkInTime}</Text>
          </div>
          <div
            style={{
              display: "table-cell",
              textAlign: "center",
              width: "1%",
              verticalAlign: "middle",
            }}
          >
            <Text className="text-xl font-bold">→</Text>
          </div>
          <div
            style={{ display: "table-cell", textAlign: "right", width: "50%" }}
          >
            <Text className="m-0 text-sm font-bold">Check-out</Text>
            <Text className="m-0 text-lg font-bold">{checkOutDate}</Text>
            <Text className="mt-0 text-sm font-bold">{checkOutTime}</Text>
          </div>
        </div>
        <CustomButton link={tripDetailLink} title="View trip detail" />
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="text-sm">
              <b>Tramona&apos;s price</b> x {numOfNights} nights
            </Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text className="text-sm">{formatCurrency(tramonaPrice)}</Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="text-sm">
              <b>Service Fee</b>
            </Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text className="text-sm">{formatCurrency(serviceFee)}</Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div
          className="mx-auto my-4 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="text-lg font-bold">Total (USD)</Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text className="text-lg font-bold">
              {formatCurrency(totalPrice)}
            </Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
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
