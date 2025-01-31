//HOSPITABLE TYPES

import {
  ListingCreatedWebhook,
  ChannelActivatedWebhook,
} from "./hospitable-webhook";

interface Listing {
  id: string;
  platform: string;
  platform_id: string;
  name: string;
  picture: string;
  location: string;
  description: string;
  first_connected_at: string;
}

interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}

interface Meta {
  current_page: number;
  from: number;
  path: string;
  per_page: number;
  to: number;
}

export type HospitableListingsResponse = {
  data: Listing[];
  links: Links;
  meta: Meta;
};

export type ReviewResponse = {
  data: {
    id: string;
    platform_id: string;
    reservation_platform_id: string;
    detailed_ratings: {
      rating: number;
      comment: string;
    }[];
  }[];
};
//Stripe types
