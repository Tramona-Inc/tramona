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
  referrerFirstAndLastName: string;
  referralCode: string;
}

export default function ReferAHostEmail({
  referrerFirstAndLastName = " A Tramona User",
  referralCode = "",
}: ReservationConfirmedEmailProps) {
  return (
    <Layout title_preview="Reservation Confirmed">
      <div className="border-b border-gray-300 bg-white p-6 text-black">
        <Text className="mb-4 text-3xl font-bold text-black">
          {`${referrerFirstAndLastName} invited you to Tramona, sign up with to earn!`}
        </Text>
        <Text className="mb-4 text-left">
          Hello, You have been invited to join Tramona
          <span className="text-black-600 underline">asdfasdf</span> has been
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
                        "https://www.tramona.com/assets/images/old-landing-bg.jpg",
                      backgroundSize: "cover",
                      borderRadius: "8px",
                    }}
                  >
                    <a
                      href="https://www.tramona.com"
                      style={{ borderRadius: "8px 8px 0 0", display: "block" }}
                    >
                      <img
                        src="https://www.tramona.com/assets/images/old-landing-bg.jpg"
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
        <Text className="mb-4 text-2xl font-bold">dfsdfasdf</Text>
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
        <CustomButton link="https://www.tramona.com" title="Start Now!" />
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
