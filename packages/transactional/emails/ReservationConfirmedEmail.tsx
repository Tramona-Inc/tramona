/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface ReservationConfirmedEmailProps {
  userName: string;
  property: string;
  hostName: string;
  nights: number;
  adults: number;
  checkInDateTime: Date;
  checkOutDateTime: Date;
  originalPrice: number;
  tramonaPrice: number;
  serviceFee: number;
  totalPrice: number;
  daysToGo: number;
}

export default function ReservationConfirmedEmail({
  userName = "John Doe",
  property = "New Beach house with Sandy Backyard Fire Ring",
  hostName = "Pam",
  nights = 5,
  adults = 2,
  checkInDateTime = new Date("2024-04-25T16:00:00"),
  checkOutDateTime = new Date("2024-04-30T12:00:00"),
  originalPrice = 200,
  tramonaPrice = 150,
  serviceFee = 20,
  totalPrice = 20,
  daysToGo = 7,
}: ReservationConfirmedEmailProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

  return (
    <Layout title_preview="Reservation Confirmed">
      <div className="border-b border-gray-300 bg-white p-6">
        <Text className="mb-4 text-3xl font-bold">
          Your reservation is confirmed
        </Text>
        <Text className="mb-4 text-left">
          Hello, {userName}. Your booking to{" "}
          <span className="text-black-600 underline">{property}</span> has been
          confirmed. Congrats and enjoy!
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
                      background:
                        "url(https://via.placeholder.com/600x300?text=Property+Image+Here&bg=cccccc)",
                      backgroundSize: "cover",
                      borderRadius: "8px",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        height: "300px",
                        color: "white",
                        textAlign: "left",
                        borderRadius: "8px",
                      }}
                    >
                      <tr>
                        <td style={{ padding: "16px" }}>
                          <p
                            style={{
                              margin: 0,
                              marginTop: "35%",
                              fontSize: "14px",
                            }}
                          >
                            The countdown to your trip begins
                          </p>
                          <p style={{ margin: 0, fontSize: "24px" }}>
                            {daysToGo} days to go
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <Text className="mb-4 text-2xl font-bold">Property Name/Title</Text>
        <div style={{ display: "table", width: "100%", marginBottom: "16px" }}>
          <div
            style={{
              display: "table-cell",
              verticalAlign: "middle",
              width: "10%",
              paddingRight: "8px",
            }}
          >
            <img
              src="https://via.placeholder.com/600x300?text=Profile+Picture+Here&bg=cccccc"
              alt="Host"
              className="h-10 w-10 rounded-full"
            />
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
            <Text className="m-0 text-xl font-bold">Your trip</Text>
            <Text className="mt-0 text-left font-bold">
              {nights} nights • {adults} Adults
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
            <Text className="m-0 text-lg font-bold">
              {formatDate(checkInDateTime)}
            </Text>
            <Text className="mt-0 text-sm font-bold">
              {formatTime(checkInDateTime)}
            </Text>
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
            <Text className="m-0 text-lg font-bold">
              {formatDate(checkOutDateTime)}
            </Text>
            <Text className="mt-0 text-sm font-bold">
              {formatTime(checkOutDateTime)}
            </Text>
          </div>
        </div>
        <Button
          href="https://www.tramona.com/my-trips"
          className="mx-auto mb-6 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
        >
          View trip details
        </Button>
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="text-sm">
              <b>Original price</b> x {nights} nights
            </Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text className="text-sm">${originalPrice}</Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div>
          <div style={{ textAlign: "left", float: "left" }}>
            <Text className="text-sm">
              <b>Tramona’s price</b> x {nights} nights
            </Text>
          </div>
          <div style={{ textAlign: "right", float: "right" }}>
            <Text className="text-sm">${tramonaPrice}</Text>
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
            <Text className="text-sm">${serviceFee}</Text>
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
            <Text className="text-lg font-bold">${totalPrice}</Text>
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
    </Layout>
  );
}
