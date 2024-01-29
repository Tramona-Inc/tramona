/**
 * Represents the request type.
 */
export type RequestType = {
  id: number;
  requestPrice: number;
  address: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  active: boolean;
  numOffers: number;
  user: User;
  createdAt: string;
  updatedAt: string;
};

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

type OfferPreview = Omit<
  OfferType,
  | "id"
  | "rating"
  | "ratingCount"
  | "status"
  | "imageUrl"
  | "airbnbUrl"
  | "address"
  | "beds"
  | "baths"
  | "createdAt"
  | "updatedAt"
  | "area"
>;

export type AmenityType = "Baths" | "Beds" | "Ocean";

export type Baths = {
  type: AmenityType;
  count: number | null;
};

export type Beds = {
  type: AmenityType;
  count: number | null;
};

export type Ocean = {
  type: AmenityType;
};

export type Amenity = Baths | Beds | Ocean;

export type OfferDetailType = OfferPreview & {
  imageUrls: string[] | null;
  avatar: string | null;
  reviewCount: number | null;
  verified: boolean | null;
  superHost: boolean | null;
  hostEmail: string | null;
  propertyDescription: string | null;
  guestReviews: string[] | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  amenites: Amenity[] | null;
};

/**
 * Represents the authority type.
 */
export type AuthorityType = {
  roleId: number;
  authority: string;
};

/**
 * Represents the referral type.
 */
export type ReferralType = {
  referralId: number;
  referralCode: string;
  userId: number;
};

/**
 * Represents the user type.
 */
export type User = {
  id: number;
  authorities: AuthorityType[];
  referral: ReferralType | null;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  numReferred: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Represents the sign-in JSON response type.
 */
export type SignInJsonResponse = {
  user: User;
  jwt: string;
};

/**
 * Represents the error response type.
 */
export type ErrorResponse = {
  message: string;
  status: number;
};

export type LiveDeals = {
  imageUrl: string | null;
  minutesAgo: number | null;
  tramonaPrice: number | null;
  oldPrice: number | null;
};

/**
 * Represents the create user API request type.
 */
export type UserCreateRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralCode: string;
};

/**
 * Represents the update user API request type.
 */
export type UserUpdateRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  referralCode: string;
};

/**
 * Represents the create offer API request type.
 */
export type OfferCreateRequest = {
  propertyName: string;
  hostName: string;
  beds: number;
  baths: number;
  area: number;
  price: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  imageUrl: string;
  airbnbUrl: string;
  requestId: number;
};

/**
 * Represents the create request API request type.
 */
export type RequestCreateRequest = {
  location: string;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  price: number;
};

export type OffersPage = {
  content: OfferType[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
  numberOfElements: number;
};

/**
 * Represents the payment intent type.
 */
export type PaymentIntentCreateRequest = {
  amount: Number;
};
