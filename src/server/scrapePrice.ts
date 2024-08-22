import { ListingSiteUrlParams } from "@/utils/listing-sites";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { scrapeUrl } from "./server-utils";

import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";




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

  const $ = await scrapeUrl(checkoutUrl);
  const jsonStr = $("#data-deferred-state-0").text();

  const priceRegex =
    /"priceBreakdown":.*"total":.*"total":.*"amountMicros":"(\d+)"/;

  const match = jsonStr.match(priceRegex);

  if (!match?.[1]) throw new Error("Failed to extract price");

  // "amountMicros" are ten-thousands of cents (e.g. $100 <-> 100,000,000)
  return Math.round(Number(match[1]) / 10000);
}


export async function scrapeTest(url: string) {
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url);

    const datesArray = await page.evaluate(() => {
      const calendarTable = document.querySelector('.calendar-table');
      if (!calendarTable) return [];

      // Get the month and year from the <th> element
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/non-nullable-type-assertion-style
      const monthYear = (document.querySelector('th.month') as HTMLElement)!.innerText.trim();
      const [month, year] = monthYear.split(' ');
      if (!month || !year) return [];

      // Create a mapping for month names to numbers
      const monthMap: Record<string, string> = {
        Gennaio: '01',
        Febbraio: '02',
        Marzo: '03',
        Aprile: '04',
        Maggio: '05',
        Giugno: '06',
        Luglio: '07',
        Agosto: '08',
        Settembre: '09',
        Ottobre: '10',
        Novembre: '11',
        Dicembre: '12',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const monthNumber = monthMap[month];

      // Find all available dates
      const availableDates = Array.from(
        calendarTable.querySelectorAll('td.available div')
      ).map((dateDiv) => {
        const day = (dateDiv as HTMLElement).innerText.trim().padStart(2, '0');
        return `${year}-${monthNumber}-${day}`;
      });

      return availableDates;
    });
    return {
      statusCode: 200,
      body: datesArray,
    };
  } catch (error) {
    const errorMessage = (error as Error).message;

    return {
      statusCode: 500,
      body: [JSON.stringify({ error: errorMessage })],
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}