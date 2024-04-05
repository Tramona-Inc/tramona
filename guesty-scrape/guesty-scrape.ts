import { db } from "@/server/db";
import { all } from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import puppeteer, { Page } from "puppeteer";
import fs from "fs/promises"

//eslint-disable-next-line import/no-anonymous-default-export
async function scrape(url: string) {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // You can add additional debugging information here if needed
  });
  try {
    const browser = await puppeteer.launch({
      headless: false,
      //protocolTimeout: 120000,
      args: [
        `--window-size=1920,1080`,
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
    });
    const page = await browser.newPage();
    const openedPages: Page[] = [];
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await delay(3000);

    async function scrollDownUntilNoChange(page: Page) {
      let previousScrollHeight = 0;
      let currentScrollHeight = -1;

      while (previousScrollHeight !== currentScrollHeight) {
        previousScrollHeight = currentScrollHeight;

        await page.evaluate(async () => {
          const element =
            document.getElementsByClassName("overflow-y-scroll")[0];
          if (element) {
            element.scrollTo(0, element.scrollHeight);
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
        currentScrollHeight = await page.evaluate(() => {
          const element =
            document.getElementsByClassName("overflow-y-scroll")[0];
          return element ? element.scrollHeight : -1;
        });
      }
    }

    // Usage
    await scrollDownUntilNoChange(page);

    // await page.evaluate(async () => {
    //   const element = document.getElementsByClassName("overflow-y-scroll")[0];
    //   if (element) {
    //     element.scrollTo(0, element.scrollHeight + 20);
    //     console.log("scroll height", element.scrollHeight);
    //   }
    // });

    await delay(2000);
    let propertyNumber = 0;

    // const propertyData: {
    //   images: (string | null)[];
    //   text: (string | undefined)[];
    //   dates: string[][];
    // }[] = [];
    let propertyData: {};

    let test = false;

    // let continueScraping = false;

    // const continuePromise = new Promise<void>((resolve) => {
    //   const interval = setInterval(() => {
    //     if (continueScraping) {
    //       console.log("done");
    //       clearInterval(interval);
    //       resolve();
    //     }
    //   }, 100);
    // });

    const handleNewPage = async (newPage: Page, propertyNumber: number) => {
      await delay(3000);
      try {
        newPage.on("console", (msg) => {
          for (let i = 0; i < msg.args().length; ++i) {
            console.log(`${i}: ${msg.args()[i]}`);
          }
        });
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
          const divWithShowAll = document.querySelector(
            'div[class*="showAll"]',
          );

          // // Check if the div element is found
          if (divWithShowAll) {
            // Trigger a click event on the div element
            divWithShowAll.click();
          } else {
            console.log("Element with text 'Show all' not found.");
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));

          //grab all text
          const propertyDescriptions = document.querySelectorAll(
            '[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])',
          );
          let propertyTexts = Array.from(propertyDescriptions).map(
            (description) => description.textContent?.trim(),
          );
          propertyTexts = propertyTexts.toString();

          const titleEndIndex = propertyTexts.indexOf("Description");
          const title = propertyTexts.substring(0, titleEndIndex);

          // Extracting description
          const descriptionStartIndex = titleEndIndex + "Description".length;
          const descriptionEndIndex = propertyTexts.indexOf("Check in");
          const description = propertyTexts.substring(
            descriptionStartIndex,
            descriptionEndIndex,
          );

          // Extracting check-in and check-out
          const checkInIndex = propertyTexts.indexOf("Check in:");
          const checkOutIndex = propertyTexts.indexOf("Check out:");
          const checkIn = propertyTexts
            .substring(checkInIndex + "Check in:".length, checkOutIndex)
            .trim();
          const checkOut = propertyTexts
            .substring(
              checkOutIndex + "Check out:".length,
              propertyTexts.indexOf("Property features"),
            )
            .trim();

          // Extracting property features
          const propertyFeaturesStartIndex =
            propertyTexts.indexOf("Property features");
          const propertyFeaturesEndIndex = propertyTexts.indexOf("Amenities");
          let propertyFeatures = propertyTexts
            .substring(
              propertyFeaturesStartIndex + "Property features".length,
              propertyFeaturesEndIndex,
            )
            .trim();

          propertyFeatures = propertyFeatures.replace(
            /([a-zA-Z])(\d)/g,
            "$1, $2",
          );

          // Extracting amenities
          const showAllDiv = document.querySelector('div[class*="showAll"]');
          const brotherWithChildren = showAllDiv?.previousElementSibling;
          const amenities = [];
          if (brotherWithChildren) {
            for (const childDiv of brotherWithChildren.children) {
              // Push the text content of each child div into the array
              amenities.push(childDiv.textContent?.trim());
            }
          }

          //grab all dates
          const allDates = [];
          let expandCalendarButton = document.querySelectorAll(
            '[class*="Button-content"]',
          );
          expandCalendarButton[0].click();

          await new Promise((resolve) => setTimeout(resolve, 1000));

          // const calendarCaptionText = document.querySelectorAll(
          //   "div.CalendarMonth_caption",
          // )[1]?.textContent;
          // const month = calendarCaptionText.substring(
          //   0,
          //   calendarCaptionText.length - 5,
          // );
          // console.log(month);

          // await new Promise((resolve) => setTimeout(resolve, 1000));

          // let tdElements = document.querySelectorAll(
          //   "div.CalendarMonth td.CalendarDay",
          // );
          // let filteredAriaLabels = Array.from(tdElements).filter((td) => {
          //   const ariaLabel = td.getAttribute("aria-label");

          //   return ariaLabel?.includes(month) && !ariaLabel?.includes("Not");
          // });

          // let dates = filteredAriaLabels.map((td) => {
          //   const ariaLabel = td.getAttribute("aria-label");
          //   const dateStartIndex = ariaLabel?.indexOf(",") + 2;
          //   const dateEndIndex = ariaLabel?.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

          //   // Extract the full date string
          //   const dateString = ariaLabel?.substring(
          //     dateStartIndex,
          //     dateEndIndex,
          //   );

          //   // Format the date as desired (e.g., March 31, 2024)
          //   return `${dateString?.trim()}, ${new Date().getFullYear()}`;
          // });

          // allDates.push(dates);

          //console.log(allDates);
          for (let i = 0; i < 5; i++) {
            let expandCalendarButton = document.querySelector(
              '[class*="nextButton"]',
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));

            try {
              expandCalendarButton.click();
            } catch (err) {
              console.log("error while clicking dates", err);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const captions = document.querySelectorAll(
              "div.CalendarMonth_caption",
            );

            captions.forEach((caption) => {
              console.log(caption.textContent);
            });

            const calendarCaptionText = document.querySelectorAll(
              "div.CalendarMonth_caption",
            )[1]?.textContent;
            const month = calendarCaptionText.substring(
              0,
              calendarCaptionText.length - 5,
            );
            console.log(month);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const tdElements = document.querySelectorAll(
              "div.CalendarMonth td.CalendarDay",
            );
            const filteredAriaLabels = Array.from(tdElements).filter((td) => {
              const ariaLabel = td.getAttribute("aria-label");
              return ariaLabel?.includes(month) && !ariaLabel?.includes("Not");
            });

            const dates = filteredAriaLabels.map((td) => {
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

          return {
            propertyNumber,
            imageSources,
            propertyTexts,
            allDates,
            title,
            description,
            checkIn,
            checkOut,
            propertyFeatures,
            amenities,
          }; // Return property number and image sources
        }, propertyNumber);

        await newPage.close(); // Close the new page after evaluating its content
        openedPages.splice(openedPages.indexOf(newPage), 1);
        return returnedData;
      } catch (err) {
        console.log("error in handle new page: ", err);
      }
    };

    browser.on("targetcreated", (target) => {
      void (async () => {
        console.log("aksjdfklasjdf", target.type());
        if (target.type() === "page") {
          const newPage = await target.page();
          openedPages.push(newPage);
          console.log("++++++++++++++++++++++", openedPages);
          try {
            console.log("does this work");
            const returnedData = await handleNewPage(newPage, propertyNumber);

            const [bedrooms, beds, bathroom] =
              returnedData.propertyFeatures.split(", ");

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (returnedData?.title) {
              propertyData[returnedData.title] = {
                ...(propertyData[returnedData.title] || {}),
                title: returnedData.title,
                images: returnedData.imageSources,
                description: returnedData.description,
                checkIn: returnedData.checkIn,
                checkOut: returnedData.checkOut,
                amenities: returnedData.amenities,
                bedrooms: bedrooms ? parseInt(bedrooms) : null, // Convert to integer if present
                beds: beds ? parseInt(beds) : null, // Convert to integer if present
                bathroom: bathroom ? parseInt(bathroom) : null,
              };
            }
            // propertyData.push({
            //   images: returnedData.imageSources,
            //   dates: returnedData.allDates,
            //   title: returnedData?.title,
            //   description: returnedData?.description,
            //   checkIn: returnedData?.checkIn,
            //   checkOut: returnedData?.checkOut,
            //   amenities: returnedData?.amenities,
            //   propertyFeatures: returnedData?.propertyFeatures,
            // });

            //console.log(propertyData);
            console.log(test);
            console.log(propertyNumber);
            propertyNumber++;
            // continueScraping = true;
          } catch (err) {
            console.log("error handling new page", err);
          }
        }
      })();
    });


      const propertiesData = await page.evaluate(async () => {
        const element = document.querySelector(".overflow-y-scroll");
        const data = {};
        if (element) {
          const divs = Array.from(element.children) as HTMLElement[];
          for (const div of divs) {
            const titleWrapperDiv = div.querySelector(
              '[data-qa="property-title"]',
            );
            const propertyType = div.querySelector('[data-qa="property-type"]');
            const propertyAddress = div.querySelector(
              '[data-qa="property-address"]',
            );
            const propertyGuestsLabel = div.querySelector(
              '[data-qa="property-guests-label"]',
            );
            const propertyFooterSpan = div.querySelector(
              'div[class*="propertyFooter"] span',
            );

            const propertyTitle = titleWrapperDiv
              ? titleWrapperDiv.textContent?.trim()
              : "";

            const propertyData = {
              type: propertyType ? propertyType.textContent?.trim() : "",
              address: propertyAddress
                ? propertyAddress.textContent?.trim()
                : "",
              guestsLabel: propertyGuestsLabel
                ? propertyGuestsLabel.textContent?.trim()
                : "",
              footerText: propertyFooterSpan
                ? propertyFooterSpan.textContent?.trim()
                : "",
            };
            if (propertyTitle) {
              data[propertyTitle] = propertyData;
            }
          }
        }
        return data;
      });
      console.log("------------------", propertiesData);
      propertyData = propertiesData;
    } catch (err) {
      console.log("error in original page ", err);
    }

    try {
      await page.evaluate(async () => {
        const element = document.querySelector(".overflow-y-scroll");
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        if (element) {
          const divs = Array.from(element.children) as HTMLElement[];
          console.log("count", divs.length);

          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < 2; i++) {
            const bookNowButton = divs[i]?.querySelector(
              '[data-qa="book-now"]',
            );
            if (bookNowButton) {
              bookNowButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true, button: 1 }),
              );

              console.log("testlklk");
              await new Promise((resolve) => setTimeout(resolve, 2000));

              console.log("laksdfkl");
            }
          }
          // const batchSize = 10;
          // const totalBatches = Math.ceil(divs.length / batchSize);

          // for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          //   const startIndex = batchIndex * batchSize;
          //   const endIndex = Math.min(startIndex + batchSize, divs.length);

          //   for (let i = startIndex; i < endIndex; i++) {
          //     const bookNowButton = divs[i]?.querySelector(
          //       '[data-qa="book-now"]',
          //     );
          //     if (bookNowButton) {
          //       bookNowButton.dispatchEvent(
          //         new MouseEvent("click", { bubbles: true, button: 1 }),
          //       );

          //       console.log("testlklk");
          //       await new Promise((resolve) => setTimeout(resolve, 2000));

          //       console.log("laksdfkl");
          //     }
          //   }

          //   // If it's not the last batch, add a 30-second delay
          //   if (batchIndex < totalBatches - 1) {
          //     console.log("Waiting for 60 seconds before the next batch...");
          //     await new Promise((resolve) => setTimeout(resolve, 60000));
          //   }
          // }
          //console.log("finished looping");
        }
        //return;
        //console.log("done");
        //return;
      });
    } catch (err) {
      console.log("aksdjfkdjs", err);
    }

    console.log("here");
    try {
      const waitForPagesToClose = async () => {
        while (openedPages.length > 0) {
          await delay(1000); // Add a delay to prevent busy waiting
        }
        console.log("All opened pages closed");
      };

      // Your existing code here...

      await waitForPagesToClose();
    } catch (err) {
      console.log("err after the page.eval", err);
    }

    return propertyData;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
