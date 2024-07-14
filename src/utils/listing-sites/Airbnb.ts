import { type ListingSite } from ".";
import { formatDateYearMonthDay } from "../utils";

export const Airbnb: ListingSite<"Airbnb"> = {
  siteName: "Airbnb",
  baseUrl: "https://www.airbnb.com",

  // https://www.airbnb.com/rooms/1234567/...
  //                              ^^^^^^^
  parseId(url) {
    return new URL(url).pathname.split("/")[2];
  },

  createListing(id) {
    return {
      id,

      getListingUrl(params) {
        const { checkIn, checkOut, numGuests } = params;
        const url = new URL(`${Airbnb.baseUrl}/rooms/${this.id}`);

        if (checkIn) {
          url.searchParams.set("check_in", formatDateYearMonthDay(checkIn));
        }
        if (checkOut) {
          url.searchParams.set("check_out", formatDateYearMonthDay(checkOut));
        }
        if (numGuests) {
          url.searchParams.set("guests", numGuests.toString());
        }

        return url.toString();
      },

      getReviewsUrl(params) {
        const listingUrl = this.getListingUrl(params);
        const [base, query] = listingUrl.split("?");
        return `${base}/reviews?${query}`;
      },

      getCheckoutUrl(params) {
        const { checkIn, checkOut, numGuests } = params;

        const url = new URL(
          `${Airbnb.baseUrl}/book/stays/${this.id}?productId=${this.id}`,
        );

        if (checkIn) {
          url.searchParams.set("checkin", formatDateYearMonthDay(checkIn));
        }
        if (checkOut) {
          url.searchParams.set("checkout", formatDateYearMonthDay(checkOut));
        }
        if (numGuests) {
          url.searchParams.set("numberOfGuests", numGuests.toString());
        }

        return url.toString();
      },
    };
  },
};
