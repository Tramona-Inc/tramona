// tramona-specific constants
export const TAX_PERCENTAGE = 0.08;
export const SUPERHOG_FEE_CENTS_PER_NIGHT = 300;
export const AVG_AIRBNB_MARKUP = 1.13868;
export const LINK_REQUEST_DISCOUNT_PERCENTAGE = 15;

//TRAVELER MARKUP MAKE SURE TO CHANGE BOTH IF UPDATED
export const TRAVELER_MARKUP = 1.075; //7.5 percent
export const REMOVE_TRAVELER_MARKUP = 0.075;

export const HOST_MARKUP = 0.975;
export const DIRECT_LISTING_MARKUP = 1.015; // 1.5% markup for direct listings

export const REFERRAL_CASHBACK = 2500;

export const MAX_REQUEST_TO_BOOK_PERCENTAGE = 80; // for requestTObook page

//ITEMS PER PAGE ON LANDING
export const ITEMS_PER_PAGE = 24;

export const airbnbHeaders = {
  "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
};

//posgis/geographic

export const EARTH_RADIUS_MILES = 3959;
export const METERS_PER_MILE = 1609.34;
export const RADIUS_FALL_BACK = METERS_PER_MILE * 20;

// generic constants
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
