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

      async getPrice(params) {
        await fetch("https://api.ipify.org/")
          .then((res) => res.text())
          .then(console.log);

        const checkoutUrl = this.getCheckoutUrl(params);

        const jsonStr = await fetch(checkoutUrl, {
          headers: airbnbRequestHeaders,
        })
          .then((res) => {
            console.log({ res });
            return res.text();
          })
          .then((html) => {
            console.log({ html });
            const $ = cheerio.load(html);
            return $("#data-deferred-state-0").text();
          }).catch((err) => {
            console.error(err);
            console.log('got here');
            throw err;
          });

        const priceRegex =
          /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;

        const match = jsonStr.match(priceRegex);

        console.log({ match, jsonStr });

        if (!match?.[1]) throw new Error("Failed to extract price");

        // "amountMicros" are ten-thousands of cents (e.g. $100 <-> 100,000,000)
        return Math.round(Number(match[1]) / 10000);
      },
    };
  },
};

const airbnbRequestHeaders = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9",
  "cache-control": "no-cache",
  "device-memory": "8",
  dpr: "2",
  ect: "4g",
  pragma: "no-cache",
  priority: "u=0, i",
  "sec-ch-ua":
    '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-ch-ua-platform-version": '"14.4.1"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
  "viewport-width": "1470",
  cookie:
    "jitney_client_session_id=61835f32-e146-430d-8925-ef0aa65fcd62; jitney_client_session_created_at=1723056021.74; jitney_client_session_updated_at=1723056021.74; bev=1723056021_EANTVmY2ZmYWI4Yz; _user_attributes=%7B%22device_profiling_session_id%22%3A%221723056021--da283183b6c87348288214b2%22%2C%22giftcard_profiling_session_id%22%3A%221723056021--4b817196c6acaa45186bb5c2%22%2C%22reservation_profiling_session_id%22%3A%221723056021--f3e21a73ca1034381c5ef47e%22%2C%22curr%22%3A%22USD%22%7D; country=US; cdn_exp_0a87d69f4448e5071=treatment; cdn_exp_5b1bb0ae0cfc2be5c=control; ak_bmsc=D21E2DC2AA307818D1CEEDA272B03536~000000000000000000000000000000~YAAQkywtF3lZARiRAQAAEWAkLhhOpaZmIrCA62uBcXU7FOMM2mg1rOxJS80CRKAHLEnMr5SkU1OMEAwUuTfo8wCZU8gtUCPiP06MgsIwE7JJczlvCCfN8N7ND4bKFaWR5kJ7AXlu+f+7M6+0CV+DVN+VzFif1nzjywMPa/JGhJP1TH0gXXbobT2lomVlGGdR+7ARzJBSHhxoXwLVNSoopju2ujQb6462RYbVnDMLzQYzqP6P8BnwKbVulsi7S3aqdu9qqxoVLDD/HAgvX8RnB3jfVv/chjNfF5lIPLCgo+z0t12zjrJtxbsGTBrDlOZnmFkmlWdFb0aAriSeS/B3Tmz3WN6WkEvYaau/PZnAWU/g/i3tE5t3tpIPGAA1QLPYnfltPu5qnFup; previousTab=%7B%22id%22%3A%22f0dcc89d-1d2c-4f24-8ae7-66835653cf82%22%7D; frmfctr=wide; everest_cookie=1723056021.EANGYzN2Q2MDhjYmRjZT.210R8GsN6KG_EzHsX5UbEM1gzsjGbRBh0doTUgrAguA; _airbed_session_id=27003015dd9d6c6b14e9a1ae6351571c; bm_sv=AE9E4E94A719A60B434AB8AE5C0BE3A4~YAAQkywtF5ReARiRAQAA8JMkLhjc7xNq1btxle5eDsWcDmyqh54bl14/cDsIS7+5ogEy7stKw3X0T9FL/Y8LZTCZNHtyBRqvwr0jT8p3iOQ4XRi7Ap6oTkEsZPoBnspJU6o526G+Zw71BHcqKc4VKt1AN/erFH/Rcz9qTWNJkRgYx1jGuqrgtpJ3tj9ZdgGh2vspqN/NVVbeYWh3eZdrUj4LKQoeJldQEBU2cRshuqa3jJRZZFwtw4Lg7G3KpWDM~1; cfrmfctr=DESKTOP",
};
