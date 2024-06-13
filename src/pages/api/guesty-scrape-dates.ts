// import fs from "fs/promises";

// import { type NextApiRequest, type NextApiResponse } from "next";
// import puppeteer, { Browser, Page } from "puppeteer";

// const urls = [
//   "https://stayawhilevillas.guestybookings.com/properties",
//   "https://openairhomes.guestybookings.com/properties",
//   // Add more URLs as needed
// ];

// //eslint-disable-next-line import/no-anonymous-default-export
// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const url = req.query.url as string;
//   process.on("unhandledRejection", (reason, promise) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//     // You can add additional debugging information here if needed
//   });
//   try {
//     let propertyData = {};

//     for (const url of urls) {
//       const browser = await puppeteer.launch({
//         headless: false,
//         args: [
//           `--window-size=1920,1080`,
//           "--disable-background-timer-throttling",
//           "--disable-backgrounding-occluded-windows",
//           "--disable-renderer-backgrounding",
//         ],
//         defaultViewport: {
//           width: 1920,
//           height: 1080,
//         },
//       });
//       const page = await browser.newPage();
//       await scrapeUrl(browser, page, url, propertyData);
//       await browser.close();
//     }

//     await fs.writeFile("./scrape-data-date.json", JSON.stringify(propertyData));

//     res.status(200).json({ success: true, data: propertyData });
//   } catch (error) {
//     res.status(500).json({ success: false, error: "Scraping failed" });
//   }
// };

// async function scrapeUrl(
//   browser: Browser,
//   page: Page,
//   url: string,
//   propertyData: {},
// ) {
//   const openedPages: Page[] = [];
//   await page.goto(url, { waitUntil: "domcontentloaded" });
//   await delay(3000);

//   async function scrollDownUntilNoChange(page: Page) {
//     let previousScrollHeight = 0;
//     let currentScrollHeight = -1;

//     while (previousScrollHeight !== currentScrollHeight) {
//       previousScrollHeight = currentScrollHeight;

//       await page.evaluate(async () => {
//         const element = document.getElementsByClassName("overflow-y-scroll")[0];
//         if (element) {
//           element.scrollTo(0, element.scrollHeight);
//         }
//       });

//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       currentScrollHeight = await page.evaluate(() => {
//         const element = document.getElementsByClassName("overflow-y-scroll")[0];
//         return element ? element.scrollHeight : -1;
//       });
//     }
//   }

//   // Usage
//   await scrollDownUntilNoChange(page);

//   await delay(2000);
//   let propertyNumber = 0;

//   const handleNewPage = async (newPage: Page) => {
//     await delay(3000);
//     try {
//       newPage.on("console", (msg) => {
//         for (let i = 0; i < msg.args().length; ++i) {
//           console.log(`${i}: ${msg.args()[i]}`);
//         }
//       });
//       const returnedData = await newPage.evaluate(async (propertyNumber) => {
//         //grab all text
//         const propertyDescriptions = document.querySelectorAll(
//           '[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])',
//         );
//         let propertyTexts = Array.from(propertyDescriptions).map(
//           (description) => description.textContent?.trim(),
//         );
//         propertyTexts = propertyTexts.toString();

//         const titleEndIndex = propertyTexts.indexOf("Description");
//         const title = propertyTexts.substring(0, titleEndIndex);

//         //grab all dates
//         const allDates = [];
//         let expandCalendarButton = document.querySelectorAll(
//           '[class*="Button-content"]',
//         );
//         expandCalendarButton[0].click();

//         await new Promise((resolve) => setTimeout(resolve, 500));

//         for (let i = 0; i < 5; i++) {
//           let expandCalendarButton = document.querySelector(
//             '[class*="nextButton"]',
//           );

//           try {
//             expandCalendarButton.click();
//           } catch (err) {
//             console.log("error while clicking dates", err);
//           }

//           await new Promise((resolve) => setTimeout(resolve, 1000));

//           const calendarCaptionText = document.querySelectorAll(
//             "div.CalendarMonth_caption",
//           )[1]?.textContent;
//           const month = calendarCaptionText.substring(
//             0,
//             calendarCaptionText.length - 5,
//           );

//           const tdElements = document.querySelectorAll(
//             "div.CalendarMonth td.CalendarDay",
//           );
//           const filteredAriaLabels = Array.from(tdElements).filter((td) => {
//             const ariaLabel = td.getAttribute("aria-label");
//             return ariaLabel?.includes(month) && !ariaLabel?.includes("Not");
//           });

//           const dates = filteredAriaLabels.map((td) => {
//             const ariaLabel = td.getAttribute("aria-label");
//             const dateStartIndex = ariaLabel?.indexOf(",") + 2;
//             const dateEndIndex = ariaLabel?.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

//             // Extract the full date string
//             const dateString = ariaLabel?.substring(
//               dateStartIndex,
//               dateEndIndex,
//             );

//             // Format the date as desired (e.g., March 31, 2024)
//             return `${dateString?.trim()}, ${new Date().getFullYear()}`;
//           });
//           allDates.push(dates);
//         }

//         return {
//           allDates,
//           title,
//         }; // Return property number and image sources
//       });

//       await newPage.close(); // Close the new page after evaluating its content
//       openedPages.splice(openedPages.indexOf(newPage), 1);
//       return returnedData;
//     } catch (err) {
//       console.log("error in handle new page: ", err);
//     }
//   };

//   browser.on("targetcreated", (target) => {
//     void (async () => {
//       if (target.type() === "page") {
//         const newPage = await target.page();
//         openedPages.push(newPage);
//         try {
//           const returnedData = await handleNewPage(newPage);

//           // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//           if (returnedData?.title) {
//             propertyData[returnedData.title] = {
//               ...(propertyData[returnedData.title] || {}),
//               dates: returnedData.allDates,
//             };
//           }

//           console.log(propertyNumber);
//           propertyNumber++;
//         } catch (err) {
//           console.log("error handling new page", err);
//         }
//       }
//     })();
//   });

//   try {
//     const propertiesData = await page.evaluate(async () => {
//       const element = document.querySelector(".overflow-y-scroll");
//       const data = {};
//       if (element) {
//         const divs = Array.from(element.children) as HTMLElement[];
//         for (const div of divs) {
//           const titleWrapperDiv = div.querySelector(
//             '[data-qa="property-title"]',
//           );
//           const propertyType = div.querySelector('[data-qa="property-type"]');
//           const propertyAddress = div.querySelector(
//             '[data-qa="property-address"]',
//           );
//           const propertyGuestsLabel = div.querySelector(
//             '[data-qa="property-guests-label"]',
//           );
//           const propertyFooterSpan = div.querySelector(
//             'div[class*="propertyFooter"] span',
//           );

//           const propertyTitle = titleWrapperDiv
//             ? titleWrapperDiv.textContent?.trim()
//             : "";

//           const propertyData = {
//             propertyType: propertyType ? propertyType.textContent?.trim() : "",
//             address: propertyAddress ? propertyAddress.textContent?.trim() : "",
//             maxNumGuests: propertyGuestsLabel?.textContent
//               ? +propertyGuestsLabel.textContent.split(" ")[0]
//               : null,
//             originalNightlyPrice:
//               parseFloat(propertyFooterSpan.textContent.trim().slice(1)) * 100,
//           };
//           if (propertyTitle) {
//             data[propertyTitle] = propertyData;
//           }
//         }
//       }
//       return data;
//     });
//     propertyData = propertiesData;
//   } catch (err) {
//     console.log("error in original page ", err);
//   }

//   await page.evaluate(async () => {
//     const element = document.querySelector(".overflow-y-scroll");
//     if (element) {
//       const divs = Array.from(element.children) as HTMLElement[];
//       console.log("count", divs.length);

//       // eslint-disable-next-line @typescript-eslint/prefer-for-of
//       for (let i = 0; i < divs.length; i++) {
//         const bookNowButton = divs[i]?.querySelector('[data-qa="book-now"]');
//         if (bookNowButton) {
//           bookNowButton.dispatchEvent(
//             new MouseEvent("click", { bubbles: true, button: 1 }),
//           );

//           console.log("testlklk");
//           const timeout = 15000;
//           const startTime = Date.now();
//           while (Date.now() - startTime < timeout) {
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//           }

//           console.log("laksdfkl");
//         }
//       }
//     }
//   });
//   console.log("here");
//   try {
//     const waitForPagesToClose = async () => {
//       while (openedPages.length > 0) {
//         await delay(1000); // Add a delay to prevent busy waiting
//       }
//       console.log("All opened pages closed");
//     };

//     await waitForPagesToClose();
//   } catch (err) {
//     console.log("err after the page.eval", err);
//   }
// }

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
