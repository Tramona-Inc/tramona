import { type ListingSite } from ".";
import { formatDateYearMonthDay } from "../utils";
import * as cheerio from "cheerio";

export const Airbnb: ListingSite<"Airbnb"> = {
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

      async getPrice(params) {
        const checkoutUrl = this.getCheckoutUrl(params);

        const jsonStr = await fetch(checkoutUrl)
          .then((res) => res.text())
          .then((html) => {
            const $ = cheerio.load(html);
            return $("#data-deferred-state-0").text();
          });

        const priceRegex =
          /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;

        const match = jsonStr.match(priceRegex);

        console.log(match);

        if (!match?.[1]) throw new Error("Failed to extract price");

        // "amountMicros" are ten-thousands of cents (e.g. $100 <-> 100,000,000)
        return Math.round(Number(match[1]) / 10000);
      },
    };
  },
};
