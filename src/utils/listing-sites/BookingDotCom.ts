import { type ListingSite } from ".";
import { formatDateYearMonthDay } from "../utils";

export const BookingDotCom: ListingSite<"Booking.com"> = {
  siteName: "Booking.com",
  baseUrl: "https://www.booking.com",

  // https://www.booking.com/hotel/us/name-of-place.html
  //                                  ^^^^^^^^^^^^^
  parseId(url) {
    return url.match(/\/hotel\/(.+)\.html/)?.[1];
  },

  parseUrlParams(url) {
    const urlObj = new URL(url);
    const numGuestsStr = urlObj.searchParams.get("group_adults");

    return {
      checkIn: urlObj.searchParams.get("checkin") ?? undefined,
      checkOut: urlObj.searchParams.get("checkout") ?? undefined,
      numGuests: numGuestsStr ? parseInt(numGuestsStr) : undefined,
    };
  },

  createListing(id) {
    return {
      id,
      site: this,

      getListingUrl(params) {
        const { checkIn, checkOut, numGuests } = params;
        const url = new URL(`${BookingDotCom.baseUrl}/hotel/${this.id}.html`);

        if (checkIn) {
          url.searchParams.set("checkin", formatDateYearMonthDay(checkIn));
        }
        if (checkOut) {
          url.searchParams.set("checkout", formatDateYearMonthDay(checkOut));
        }
        if (numGuests) {
          url.searchParams.set("group_adults", numGuests.toString());
        }

        return url.toString();
      },

      getReviewsUrl(params) {
        const listingUrl = this.getListingUrl(params);
        return `${listingUrl}#tab-reviews`;
      },

      getCheckoutUrl(params) {
        const listingUrl = this.getListingUrl(params);
        return `${listingUrl}#availability`;
      },

      getPrice(params) {
        throw new Error("not implemented"); // TODO
      },
    };
  },
};
