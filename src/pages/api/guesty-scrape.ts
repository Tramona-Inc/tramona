import { all } from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import puppeteer, { Page } from "puppeteer";

//eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query.url as string;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(3000);

    // await page.evaluate(async () => {
    //   const element = document.getElementsByClassName("overflow-y-scroll")[0];
    //   if (element) {
    //     element.scrollTo(0, element.scrollHeight);
    //   }
    // });

    await delay(2000);
    let propertyNumber = 0;

    const propertyData = [];

    let continueScraping = false;

    const continuePromise = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (continueScraping) {
          console.log("done");
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    const handleNewPage = async (newPage: Page, propertyNumber: number) => {
      await delay(3000);
      const returnedData = await newPage.evaluate(async (propertyNumber) => {
        const slides = Array.from(
          document.querySelectorAll(
            'div[class*="mainSlider"] .slick-slide:not(.slick-cloned)',
          ),
        );
        const numClicks = slides.length - 1;
        console.log(numClicks);

        const arrow = document.getElementsByClassName("slick-next")[0];

        for (let i = 0; i < numClicks; i++) {
          arrow.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        const slickSlideDivs = document.querySelectorAll(
          'div[class*="mainSlider"] .slick-slide:not(.slick-cloned) img',
        );

        const imageSources = Array.from(slickSlideDivs).map((img) =>
          img.getAttribute("src"),
        );

        //expand amenities

        //grab all text
        const propertyDescriptions = document.querySelectorAll(
          '[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])',
        );
        const propertyTexts = Array.from(propertyDescriptions).map(
          (description) => description.textContent?.trim(),
        );

        //grab all dates
        const allDates = [];
        let expandCalendarButton = document.querySelectorAll(
          '[class*="Button-content"]',
        );
        expandCalendarButton[0].click();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        let tdElements = document.querySelectorAll(
          'div.CalendarMonth[data-visible="true"] td.CalendarDay',
        );
        let filteredAriaLabels = Array.from(tdElements).filter((td) => {
          const ariaLabel = td.getAttribute("aria-label");
          return !ariaLabel.includes("Not");
        });

        let dates = filteredAriaLabels.map((td) => {
          const ariaLabel = td.getAttribute("aria-label");
          const dateStartIndex = ariaLabel?.indexOf(",") + 2;
          const dateEndIndex = ariaLabel?.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

          // Extract the full date string
          const dateString = ariaLabel?.substring(dateStartIndex, dateEndIndex);

          // Format the date as desired (e.g., March 31, 2024)
          return `${dateString?.trim()}, ${new Date().getFullYear()}`;
        });

        allDates.push(dates);

        console.log(allDates);

        for (let i = 0; i < 5; i++) {
          expandCalendarButton = document.querySelectorAll(
            '[class*="Button-content"]',
          );
          expandCalendarButton[2].click();
          await new Promise((resolve) => setTimeout(resolve, 1000));

          tdElements = document.querySelectorAll(
            'div.CalendarMonth[data-visible="true"] td.CalendarDay',
          );
          filteredAriaLabels = Array.from(tdElements).filter((td) => {
            const ariaLabel = td.getAttribute("aria-label");
            return !ariaLabel.includes("Not");
          });

          dates = filteredAriaLabels.map((td) => {
            const ariaLabel = td.getAttribute("aria-label");
            const dateStartIndex = ariaLabel?.indexOf(",") + 2;
            const dateEndIndex = ariaLabel?.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

            // Extract the full date string
            const dateString = ariaLabel?.substring(
              dateStartIndex,
              dateEndIndex,
            );

            // Format the date as desired (e.g., March 31, 2024)
            return `${dateString?.trim()}, ${new Date().getFullYear()}`;
          });
          allDates.push(dates);
        }

        //await new Promise((resolve) => setTimeout(resolve, 200000));

        return { propertyNumber, imageSources, propertyTexts, allDates }; // Return property number and image sources
      }, propertyNumber);

      await newPage.close(); // Close the new page after evaluating its content
      return returnedData;
    };

    browser.on("targetcreated", async (target) => {
      console.log("aksjdfklasjdf", target.type());
      if (target.type() === "page") {
        const newPage = await target.page();
        try {
          console.log("does this work");
          const returnedData = await handleNewPage(newPage, propertyNumber);
          propertyData.push({
            images: returnedData.imageSources,
            text: returnedData.propertyTexts,
            dates: returnedData.allDates,
          });
          console.log(propertyData);
          console.log(propertyNumber);
          propertyNumber++;
          continueScraping = true;
        } catch (err) {
          console.log("error handling new page", err);
        }
      }
    });

    await page.evaluate(
      async (continueScraping, continuePromise) => {
        console.log(continueScraping);
        const element = document.querySelector(".overflow-y-scroll");
        await new Promise((resolve) => setTimeout(resolve, 300000));
        if (element) {
          const divs = Array.from(element.children) as HTMLElement[];
          console.log("count", divs.length);

          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < divs.length; i++) {
            const bookNowButton = divs[i]?.querySelector(
              '[data-qa="book-now"]',
            );
            if (bookNowButton) {
              bookNowButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true, button: 1 }),
              );
              continueScraping = false;

              console.log("testlklk");
              // try {
              //   console.log('in hnereer');
              //   await continuePromise; // Wait until continueScraping becomes true
              // } catch(err) {
              //   console.log('err waiting for promise', err);
              // }
              await new Promise((resolve) => setTimeout(resolve, 30000));

              console.log("laksdfkl");
            }
          }
        }
      },
      continueScraping,
      continuePromise,
    );

    await browser.close();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
