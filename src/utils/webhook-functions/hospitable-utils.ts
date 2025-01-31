import axios from "axios";
import { HospitableListingsResponse, ReviewResponse } from "@/pages/api/types";

export const getHospitableReviewsByChanelId = async (
  channelId: string,
): Promise<unknown> => {
  console.log(channelId);

  const reviews = await axios
    .get<ReviewResponse>(
      `https://connect.hospitable.com/api/v1/channels/${channelId}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
      },
    )
    .then(() => {
      console.log("hi");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("hi");

  console.log(reviews);

  return reviews;
};

export const getCustomersChannelByCustomerId = async (
  customerId: string,
): Promise<HospitableListingsResponse> => {
  const channel = (
    await axios.get<HospitableListingsResponse>(
      `https://connect.hospitable.com/api/v1/customers/${customerId}/channels`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
      },
    )
  ).data;

  console.log(channel);
  return channel;
};

export const getASingleCustomerChanel = async ({
  customerId,
  channelId,
}: {
  customerId: string;
  channelId: string;
}): Promise<HospitableListingsResponse> => {
  const channel = (
    await axios.get<HospitableListingsResponse>(
      `https://connect.hospitable.com/api/v1/customers/${customerId}/channels/${channelId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HOSPITABLE_API_KEY}`,
        },
      },
    )
  ).data;

  console.log(channel);
  return channel;
};
