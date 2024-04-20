import fs from "fs/promises";
import { type NextApiRequest, type NextApiResponse } from "next";
import puppeteer, { Browser, Page } from "puppeteer";

const urls = [
  // "https://stayawhilevillas.guestybookings.com/properties",
  // "https://openairhomes.guestybookings.com/properties",
  // "https://staywildflower.guestybookings.com/properties",
  // "https://mybookings.guestybookings.com/properties",
  // "https://artthaus.guestybookings.com/properties",
  // "https://abode.guestybookings.com/properties",
  // "https://goodliferesorts.guestybookings.com/properties?city=San+Diego",
  // "https://titanbr.guestybookings.com/properties?city=San+Diego",
  // "https://alter.guestybookings.com/properties",
  // "https://cardo.guestybookings.com/properties",
  // "https://excelsiorstays.guestybookings.com/properties?city=San+Diego&country=United+States",
  // "https://stayrelax.guestybookings.com/properties",
  // "https://skylandvacation.guestybookings.com/properties",
  // "https://amazinghome-presente.guestybookings.com/properties",
  // "https://happiesthouserentals.guestybookings.com/properties",
  // "https://dcfurnishedliving.guestybookings.com/properties",
  // "https://homesweetcity.guestybookings.com/properties",
  // "https://greatdwellings.guestybookings.com/properties",
  // "https://staylocal.guestybookings.com/properties",
  // "https://yolostays.guestybookings.com/properties",
  // "https://valtarealty.guestybookings.com/properties",
  // "https://maverick.guestybookings.com/properties",
      "https://luluhomes.guestybookings.com/properties",
  // "https://westhome.guestybookings.com/properties?city=Atlanta",
  // "https://skyhaus.guestybookings.com/properties",
  // "https://woolworthupstairs.guestybookings.com/properties",
  // "https://welcomematvacations.guestybookings.com/properties",
  // "https://aloeyall.guestybookings.com/properties",
  // "https://beckonguests.guestybookings.com/properties",
  // "https://staylocalatx.guestybookings.com/properties",
  // "https://fortunatefoundations.guestybookings.com/properties",
  // "https://thecpcdenver.guestybookings.com/properties",
  // "https://stayinmydistrict.guestybookings.com/properties",
  // "https://thebungalows.guestybookings.com/properties",
      "https://booknow.vare.properties/properties",
  // "https://kingstreetcollection.guestybookings.com/properties",
  // "https://thenicholas.guestybookings.com/properties",
  // "https://homefrontstays.guestybookings.com/properties",
     "https://vacationcondosforless.guestybookings.com/properties",
  // "https://oasiscollections.guestybookings.com/properties",
      "https://staywithhideaway.guestybookings.com/properties",
  // "https://experiencehedge.guestybookings.com/properties",
  // "https://seagrapehospitality.guestybookings.com/properties",
  // "https://lajollabungalows.guestybookings.com/properties",
  // "https://nxt.guestybookings.com/properties",
  // "https://go_travli.guestybookings.com/properties?city=Sedona&country=United+States",
  // "https://halcyonhomehosting.guestybookings.com/properties",
  // "https://mammothrockvillas.guestybookings.com/properties",
  // "https://unwrittenstays.guestybookings.com/properties",
  // "https://scottsdalebeachclub.guestybookings.com/properties",
  // "https://thectbrothers.guestybookings.com/properties",
  // "https://arizonabnb.guestybookings.com/properties",
  // "https://aspening.guestybookings.com/properties",
  // "https://townandislandcompany.guestybookings.com/properties",
  // "https://brightwild.guestybookings.com/properties",
  // "https://tahoeasap.guestybookings.com/properties",
  // "https://laketahoevacationhomes.guestybookings.com/properties",
  // "https://vistasvacations.guestybookings.com/properties",
  // "https://pvhawaii.guestybookings.com/properties",
  // "https://rsbmanagement.guestybookings.com/properties",
  // "https://myobxvacation.guestybookings.com/properties",
  // "https://vegas.guestybookings.com/properties",
  // "https://mahin.guestybookings.com/properties",
  // "https://lasvegas.guestybookings.com/properties",
  // "https://saltairecottages.guestybookings.com/properties",
  // "https://shsrealtyservices.guestybookings.com/properties",
  // "https://blissfulliving.guestybookings.com/properties",
  // "https://reluxme.guestybookings.com/properties",
  // "https://zionstinygetaway.guestybookings.com/properties",
  // "https://coopmedcenter.guestybookings.com/properties",
      "https://seconddoor.guestybookings.com/properties",
  // "https://walkervacationrentals.guestybookings.com/properties",
  // "https://beachhomespuntacana.guestybookings.com/properties",
  // "https://russopg.guestybookings.com/properties",
  // "https://hostedjourney.guestybookings.com/properties",
  // Add more URLs as needed
];

//eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // You can add additional debugging information here if needed
  });
  try {
    let propertyData = {};

    for (const url of urls) {
      const browser = await puppeteer.launch({
        // headless: false,
        protocolTimeout: 4000000,
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
      const newData = await scrapeUrl(browser, page, url, propertyData); // Retrieve data from scrapeUrl function
      propertyData = { ...propertyData, ...newData };
      await browser.close();
    }

    await fs.writeFile("./scrape-data-minus.json", JSON.stringify(propertyData));

    res.status(200).json({ success: true, data: propertyData });
  } catch (error) {
    console.log("error here", error);
    res.status(500).json({ success: false, error: "Scraping failed" });
  }
};

async function scrapeUrl(
  browser: Browser,
  page: Page,
  url: string,
  propertyData: Record<string, any>,
) {
  let tempData = propertyData;
  const openedPages: Page[] = [];
  // await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.goto(url);
  await delay(3000);


  async function scrollDownUntilNoChange(page: Page) {
    let previousScrollHeight = 0;
    let currentScrollHeight = -1;

    while (previousScrollHeight !== currentScrollHeight) {
      previousScrollHeight = currentScrollHeight;

      await page.evaluate(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      currentScrollHeight = await page.evaluate(() => {
        return document.documentElement.scrollHeight;
      });
    }
  }

  // async function scrollDownUntilNoChange(page: Page) {
  //   let previousScrollHeight = 0;
  //   let currentScrollHeight = -1;

  //   while (previousScrollHeight !== currentScrollHeight) {
  //     previousScrollHeight = currentScrollHeight;

  //     await page.evaluate(async () => {
  //       const element = document.getElementsByClassName("overflow-y-scroll")[0];
  //       if (element) {
  //         element.scrollTo(0, element.scrollHeight);
  //       }
  //     });

  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     currentScrollHeight = await page.evaluate(() => {
  //       const element = document.getElementsByClassName("overflow-y-scroll")[0];
  //       return element ? element.scrollHeight : -1;
  //     });
  //   }
  // }

  // Usage
  await scrollDownUntilNoChange(page);

  await delay(2000);

  const numChildren = await page.evaluate(() => {
    const div = document.querySelector('div[data-property-list="true"]');
    return div ? div.children.length : 0;
  });

  console.log("Number of children:", numChildren);


  let propertyNumber = 0;

  // const propertyData: {
  //   images: (string | null)[];
  //   text: (string | undefined)[];
  //   dates: string[][];
  // }[] = [];

  const handleNewPage = async (newPage: Page, propertyNumber: number) => {
    await delay(3000);
    try {
      newPage.on("console", (msg) => {
        for (let i = 0; i < msg.args().length; ++i) {
          console.log(`${i}: ${msg.args()[i]}`);
        }
      });
      const returnedData = await newPage.evaluate(async (propertyNumber: number) => {

        const slides = Array.from(
          document.querySelectorAll(
            'div[class*="mainSlider"] .slick-slide:not(.slick-cloned)',
          ),
        );
        const numClicks = Math.min(60, slides.length - 1);

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

        // expand amenities
        const divWithShowAll = document.querySelector('div[class*="showAll"]');

        // Check if the div element is found
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
        const propertyFeaturesEndIndex = propertyTexts.lastIndexOf("Amenities");
        let propertyFeatures = propertyTexts
          .substring(
            propertyFeaturesStartIndex + "Property features".length,
            propertyFeaturesEndIndex,
          )
          .trim();

        if (propertyFeatures) {
          propertyFeatures = propertyFeatures.replace(
            /([a-zA-Z])(\d+(\.\d+)?)/g,
            "$1, $2",
          );
        }

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

        return {
          propertyNumber,
          imageSources,
          propertyTexts,
          // allDates,
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
      if (target.type() === "page") {
        const newPage = await target.page();
        openedPages.push(newPage);
        try {
          const returnedData = await handleNewPage(newPage, propertyNumber);

          let bedrooms, beds, bathroom;

          if (returnedData?.propertyFeatures) {
            [bedrooms, beds, bathroom] =
              returnedData.propertyFeatures.split(", ");
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (returnedData?.title) {
            tempData[returnedData.title] = {
              ...(tempData[returnedData.title] || {}),
              title: returnedData.title,
              images: returnedData.imageSources,
              description: returnedData.description,
              checkIn: returnedData.checkIn,
              checkOut: returnedData.checkOut,
              amenities: returnedData.amenities,
              numBedrooms: bedrooms ? parseInt(bedrooms) : null, // Convert to integer if present
              numBeds: beds ? parseInt(beds) : null, // Convert to integer if present
              numBathroom: bathroom ? parseFloat(bathroom) : null,
            };
          }

          //const parsedProperty = propertyInsertSchema.parse(propertyData);

          console.log(
            propertyNumber,
            returnedData?.title,
            bedrooms,
            beds,
            bathroom,
          );
          propertyNumber++;
        } catch (err) {
          console.log("error handling new page", err);
        }
      }
    })();
  });

  try {
    const propertiesData = await page.evaluate(async () => {
      const element = document.querySelector('div[data-property-list="true"]');

      // const element = document.querySelector(".overflow-y-scroll");
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
          let propertyFooterSpan = div.querySelector(
            'div[class*="propertyFooter"] span',
          );

          const propertyTitle = titleWrapperDiv
            ? titleWrapperDiv.textContent?.trim()
            : "";

          const propertyData = {
            propertyType: propertyType ? propertyType.textContent?.trim() : "",
            address: propertyAddress ? propertyAddress.textContent?.trim() : "",
            maxNumGuests: propertyGuestsLabel?.textContent
              ? +propertyGuestsLabel.textContent.split(" ")[0]
              : null,
            originalNightlyPrice:
              parseFloat(
                propertyFooterSpan?.textContent
                  .replace(/,/g, "")
                  .trim()
                  .slice(1),
              ) * 100,
          };
          if (propertyTitle) {
            data[propertyTitle] = propertyData;
          }
        }
      }
      return data;
    });
    tempData = propertiesData;
  } catch (err) {
    console.log("error in original page ", err);
  }

  try {
    await page.evaluate(async () => {
      // const element = document.querySelector(".overflow-y-scroll");
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      const element = document.querySelector('div[data-property-list="true"]');

      if (element) {
        const divs = Array.from(element.children) as HTMLElement[];

        const batchSize = 10;
        const totalBatches = Math.ceil(divs.length / batchSize);

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const startIndex = batchIndex * batchSize;
          const endIndex = Math.min(startIndex + batchSize, divs.length);

          for (let i = startIndex; i < endIndex; i++) {
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

          // If it's not the last batch, add a 30-second delay
          if (batchIndex < totalBatches - 1) {
            console.log("Waiting for 60 seconds before the next batch...");
            const timeout = 50000;
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }
      }
    });
  } catch (err) {
    console.log("error in page evaluate", err);
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
  return tempData;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
