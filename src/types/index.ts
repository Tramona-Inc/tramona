/**
 * Represents the offer type.
 */
export type OfferType = {
  id: number;
  propertyName: string;
  hostName: string;
  beds: number;
  baths: number;
  area: number;
  price: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  status: string;
  imageUrl: string;
  airbnbUrl: string;
  requestId: number;
  createdAt: string;
  updatedAt: string;
  address: string;
};

/**
 * Represents the live deals type.
 */
export type LiveDeals = {
  imageUrl: string | null;
  minutesAgo: number | null;
  tramonaPrice: number | null;
  oldPrice: number | null;
};
