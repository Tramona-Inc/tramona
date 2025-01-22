import { ListingSiteUrlParams } from "@/utils/listing-sites";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { urlScrape } from "./server-utils";
import { db } from "./db";
import { properties } from "./db/schema";
import { eq } from "drizzle-orm";

// TODO: add support for other listing sites
export async function scrapeAirbnbPrice({
  airbnbListingId,
  params,
}: {
  airbnbListingId: string;
  params: ListingSiteUrlParams;
}) {
  const checkoutUrl =
    Airbnb.createListing(airbnbListingId).getCheckoutUrl(params);
  console.log(checkoutUrl, "checkoutUrl");
  const $ = await urlScrape(checkoutUrl);
  const jsonStr = $("#data-deferred-state-0").text();
  const errorPattern = /"errorTitle":(null|"[^"]*"),"errorMessage":"([^"]*)"/g;

  // Array to store matches
  const errors = [];
  let matchError;

  // Loop through matches
  while ((matchError = errorPattern.exec(jsonStr)) !== null) {
    const errorTitle = matchError[1] === "null" ? null : matchError[1]?.replace(/"/g, "");
    const errorMessage = matchError[2];
    errors.push({ errorTitle, errorMessage });
  }

  // Output the results
  errors.forEach((error, index) => {
    console.log(`Error ${index + 1}: Title: ${error.errorTitle}, Message: ${error.errorMessage}`);
  });
  const priceRegex =
    /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;

  const match = jsonStr.match(priceRegex);

  if (errors.length > 0) {
    const propertyName = await db.query.properties.findFirst({
      where: eq(properties.originalListingId, airbnbListingId),
      columns: {
        name: true,
      },
    });



    throw new Error(
      errors
        .map(
          (error) =>
            `${propertyName?.name ? `${propertyName.name}: ` : ""}${error.errorTitle ? `${error.errorTitle}: ` : ""}${error.errorMessage}`,
        )
        .join("\n"),
    );
  }

  if (!match?.[1])
    throw new Error(
      "Unable to retrieve the Airbnb price. The property may have already been booked, or the minimum stay requirements may not be met:",
    );

  // "amountMicros" are ten-thousands of cents (e.g. $100 <-> 100,000,000)
  return Math.round(Number(match[1]) / 10000);
}

// export async function scrapeAirbnbPrice({
//   airbnbListingId,
//   params,
// }: {
//   airbnbListingId: string;
//   params: ListingSiteUrlParams;
// }): Promise<number | null> {
//   try {
//     const checkoutUrl =
//       Airbnb.createListing(airbnbListingId).getCheckoutUrl(params);
//     const $ = await urlScrape(checkoutUrl);
//     const jsonStr = $("#data-deferred-state-0").text();

//     // Parse errors from the response
//     const errors = [];
//     const errorPattern = /"errorTitle":(null|"[^"]*"),"errorMessage":"([^"]*)"/g;
//     let matchError;

//     while ((matchError = errorPattern.exec(jsonStr)) !== null) {
//       const errorTitle = matchError[1] === "null" ? null : matchError[1]?.replace(/"/g, "");
//       const errorMessage = matchError[2];
//       errors.push({ errorTitle, errorMessage });
//     }

//     // Log all found errors
//     errors.forEach((error, index) => {
//       console.log(`Found Error ${index + 1}:`, { title: error.errorTitle, message: error.errorMessage });
//     });

//     if (errors.length > 0) {
//       console.log("Validation errors found, attempting to fetch property name...");

//       let propertyName = null;
//       try {
//         const result = await db.select().from(properties).where(eq(properties.originalListingId, airbnbListingId));
//         propertyName = result[0]?.name;
//         console.log("Property name fetched successfully:", propertyName);
//       } catch (dbError) {
//         console.error("Failed to fetch property name:", dbError);
//       }

//       const errorMessages = errors
//         .map(error => {
//           const prefix = propertyName ? `${propertyName}: ` : "";
//           const titlePart = error.errorTitle ? `${error.errorTitle}: ` : "";
//           return `${prefix}${titlePart}${error.errorMessage}`;
//         })
//         .join("\n");

//       console.log("Throwing error with messages:", errorMessages);
//       throw new Error(errorMessages);
//     }

//     // Parse price from response
//     const priceRegex = /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;
//     const match = jsonStr.match(priceRegex);

//     if (!match?.[1]) {
//       throw new Error(
//         "Unable to retrieve the Airbnb price. The property may have already been booked, or the minimum stay requirements may not be met."
//       );
//     }

//     // Convert amountMicros to dollars
//     const price = Math.round(Number(match[1]) / 10000);
//     console.log("Successfully parsed price:", price);
//     return price;

//   } catch (error) {
//     console.error("Error in scrapeAirbnbPrice:", error instanceof Error ? error.message : error);

//     return null;
//   }
// }
