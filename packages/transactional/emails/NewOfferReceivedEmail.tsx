/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface NewOfferEmailProps {
  userName: string;
  property: string;
  airbnbPrice: number;
  ourPrice: number;
  discountPercentage: number;
  nights: number;
  adults: number;
  checkInDateTime: Date;
  checkOutDateTime: Date;
  imgUrl: string;
  offerLink: string;
}

export default function NewOfferEmail({
  userName = "John Doe",
  property = "Property Name/Title",
  airbnbPrice = 475,
  ourPrice = 375,
  discountPercentage = 21,
  nights = 5,
  adults = 2,
  imgUrl = "",
  checkInDateTime = new Date("2024-04-25T16:00:00"),
  checkOutDateTime = new Date("2024-04-30T12:00:00"),
  offerLink = "tramona.com",
}: NewOfferEmailProps) {
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
    <Layout title_preview="New offer received">
      <div className="border-b border-gray-300 bg-white p-6">
        <Text className="mb-4 text-3xl font-bold">New offer received</Text>
        <Text className="mb-4 text-left">
          Hello, {userName}. You just received an offer.{" "}
          <a href={offerLink} className="text-black underline">
            Click here
          </a>{" "}
          to check it out!
        </Text>
        <div className="mb-8">
          <img src={imgUrl} alt="Property" className="w-full rounded-lg" />
        </div>
        <Text className="mb-4 text-2xl font-bold">{property}</Text>
        <div style={{ width: "100%", marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-block",
              width: "30%",
              verticalAlign: "middle",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "26px",
                color: "#6b7280",
                textDecoration: "line-through",
                margin: 0,
              }}
            >
              ${airbnbPrice}
            </Text>
            <Text style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>
              Airbnb price
            </Text>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "30%",
              verticalAlign: "middle",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "26px",
                color: "#DF0000",
                margin: 0,
              }}
            >
              ${ourPrice}
            </Text>
            <Text
              style={{
                color: "#DF0000",
                fontSize: "11px",
                margin: 0,
                marginLeft: "6px",
              }}
            >
              Our price
            </Text>
          </div>
          <div
            style={{
              display: "inline-block",
              width: "30%",
              verticalAlign: "middle",
              backgroundColor: "#DF0000",
              color: "white",
              fontWeight: "600",
              fontSize: "20px",
              padding: "10px 0px",
              float: "right",
              textAlign: "center",
            }}
          >
            {discountPercentage}% OFF
          </div>
        </div>
        <div
          className="mx-auto my-6 w-full"
          style={{ borderBottom: "2px solid #e0e0e0" }}
        ></div>
        {/* <Text className="text-center mb-4">Don't miss this deal!</Text>
        <div style={{ width: '70%', margin: '0 auto 24px auto', textAlign: 'center' }}>
          <table style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>0</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>0</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>:</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>2</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>3</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>:</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>5</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>9</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>:</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>5</td>
              <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', padding: '8px', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>9</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', paddingLeft: '16px' }}>Days</td>
              <td style={{ textAlign: 'center', paddingLeft: '16px' }}></td>
              <td style={{ textAlign: 'center', paddingLeft: '50px' }}>Hours</td>
              <td style={{ textAlign: 'center', paddingLeft: '16px' }}></td>
              <td style={{ textAlign: 'center', paddingLeft: '76px' }}>Minutes</td>
              <td style={{ textAlign: 'center', paddingLeft: '16px' }}></td>
              <td style={{ textAlign: 'center', paddingLeft: '112px' }}>Seconds</td>
            </tr>
          </tbody>
        </table>
        </div> */}
        <div style={{ textAlign: "left", float: "left" }}>
          <Text className="m-0 text-xl font-bold">Your trip</Text>
          <Text className="mt-0 text-left font-bold">
            {nights} nights • {adults} Adults
          </Text>
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
          className="mx-auto mb-6 w-11/12 rounded-md bg-green-900 px-6 py-3 text-center text-lg text-white"
          href={offerLink}
        >
          View offer
        </Button>
      </div>
    </Layout>
  );
}
