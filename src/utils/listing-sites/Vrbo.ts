import { type ListingSite } from ".";
import { formatDateYearMonthDay } from "../utils";

export const Vrbo: ListingSite<"Vrbo"> = {
  siteName: "Vrbo",
  baseUrl: "https://www.vrbo.com",

  // https://www.vrbo.com/1234567/...
  //                      ^^^^^^^
  parseId(url) {
    return new URL(url).pathname.split("/")[1];
  },

  createListing(id) {
    return {
      id,
      site: this,

      getListingUrl(params) {
        const { checkIn, checkOut, numGuests } = params;
        const url = new URL(`${Vrbo.baseUrl}/${this.id}`);

        if (checkIn) {
          url.searchParams.set("startDate", formatDateYearMonthDay(checkIn));
        }
        if (checkOut) {
          url.searchParams.set("endDate", formatDateYearMonthDay(checkOut));
        }
        if (numGuests) {
          url.searchParams.set("adults", numGuests.toString());
        }

        return url.toString();
      },

      getReviewsUrl(params) {
        const listingUrl = this.getListingUrl(params);
        return `${listingUrl}&pwaDialog=reviews`;
      },

      getCheckoutUrl(params) {
        const listingUrl = this.getListingUrl(params);
        return `${listingUrl}&pwaDialogNested=price-details`;
      },
    };
  },
};
