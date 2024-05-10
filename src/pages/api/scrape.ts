import { type NextApiRequest, type NextApiResponse } from "next";
import puppeteer from "puppeteer";

type TwilioRequestBody = {
  url: string;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { url } = req.body as TwilioRequestBody;
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage(); // Type assertion
      await page.goto(url, { waitUntil: "domcontentloaded" });

      await delay(2000);

      const dialogExists = await page.$('[role="dialog"]');
      if (dialogExists) {
        // If popup appears, click outside of it to dismiss
        await page.mouse.click(1, 1); // Click on a point outside the popup (e.g., top-left corner)
      }

      await delay(500);

      await page.evaluate(() => {
        const xpathResult = document.evaluate(
          '//span[contains(text(), "Reserve")]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        );

        // Click reserve
        const firstNode = xpathResult.singleNodeValue;
        if (firstNode && firstNode instanceof HTMLElement) {
          firstNode.parentElement?.click();
        }
      });
      await delay(2000);

      const priceItems = await page.evaluate(() => {
        const divsWithPriceItemTestIds = Array.from(document.querySelectorAll('div[data-testid^="price-item"]'));
        const prices = divsWithPriceItemTestIds.map(div => {
          const testId = div.getAttribute('data-testid');
          if (testId && testId.startsWith('price-item-ACCOMMODATION')) {
            const siblingDivs = Array.from(div.parentElement?.children ?? []);
            const siblingTextContents = siblingDivs.map(sibling => sibling.textContent?.trim());
            return siblingTextContents;
          } else {
            const span = div.querySelector('span');
            return span ? span.textContent?.trim() : null;
          }
        });
        return prices.flat().filter(price => price !== null);
      });

      const imgSrcUrl = await page.evaluate(() => {
        const listingCardSection = document.querySelector('[data-section-id="LISTING_CARD"]');
        if (!listingCardSection) return null;

        const img = listingCardSection.querySelector('img');
        return img ? img.getAttribute('src') : null;
      });

      const listingCardTextContent = await page.evaluate(() => {
        const listingCardSection = document.querySelector('[data-section-id="LISTING_CARD"]');
        if (!listingCardSection) return [];

        const textContents = [];
        for (const child of listingCardSection.children) {
          textContents.push(child.textContent);
        }
        return textContents.filter(Boolean);
      });
      const combinedData = [...priceItems, ...listingCardTextContent, imgSrcUrl].filter(item => item !== null && item !== undefined);

      await browser.close();

      res.status(200).json({ success: true, combinedData }); // Include the price in the response
    } catch (error) {
      res.status(500).json({ success: false, error: "Scraping failed" });
    }
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
