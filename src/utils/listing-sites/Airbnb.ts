import { type ListingSite } from ".";
import { formatDateYearMonthDay } from "../utils";

interface ExpandUrlResponse {
  expandedUrl: string;
}

export const Airbnb: ListingSite = {
  siteName: "Airbnb",
  baseUrl: "https://www.airbnb.com",

  // https://www.airbnb.com/rooms/1234567/...
  //                              ^^^^^^^
  parseId(url) {
    return new URL(url).pathname.split("/")[2];
  },

  parseUrlParams(url) {
    const urlObj = new URL(url);
    const numGuestsStr = urlObj.searchParams.get("adults");

    return {
      checkIn: urlObj.searchParams.get("check_in") ?? undefined,
      checkOut: urlObj.searchParams.get("check_out") ?? undefined,
      numGuests: numGuestsStr ? parseInt(numGuestsStr) : undefined,
    };
  },

  async expandUrl(url) {
    try {
      const response = await fetch(
        `/api/lib/expandAirbnbUrl?url=${encodeURIComponent(url)}`,
      );
      const data = (await response.json()) as ExpandUrlResponse;
      const expandedUrl: string = data.expandedUrl;
      return expandedUrl;
    } catch (error) {
      console.error(error);
    }
  },

  createListing(id) {
    return {
      id,
      site: this,

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
          url.searchParams.set("adults", numGuests.toString());
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
          `${Airbnb.baseUrl}/book/stays/${this.id}?productId=${this.id}&guestCurrency=USD`,
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
} as const;
