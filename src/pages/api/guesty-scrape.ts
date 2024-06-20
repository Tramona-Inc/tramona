// import fs from "fs/promises";
// import { type NextApiRequest, type NextApiResponse } from "next";
// import puppeteer, { Browser, Page } from "puppeteer";

// const urls = [
//   "https://traunseeresidenzen.guestybookings.com/properties",
//   "https://staywithtrifecta.guestybookings.com/properties",
//   "https://go_travli.guestybookings.com/properties",
//   "https://book.epicbnb.com/properties",
//   "https://privatevacationsutah.guestybookings.com/properties",
//   "https://bnbhyperion.guestybookings.com/properties",
//   "https://theinns.guestybookings.com/properties",
//   "https://thetreekeresort.guestybookings.com/properties",
//   "https://kfemanagement.guestybookings.com/properties",
//   "https://cabinsatcreekside.guestybookings.com/properties",
//   "https://vrmontreal.guestybookings.com/properties",
//   "https://storeylake.guestybookings.com/properties",
//   "https://yambaviewsaccommodation.guestybookings.com/properties",
//   "https://richcoast.guestybookings.com/properties",
//   "https://rentsmartmx.guestybookings.com/properties",
//   "https://mecasasucasa.guestybookings.com/properties",
//   "https://islandpropertiesco1.guestybookings.com/properties",
//   "https://theweekendescape.guestybookings.com/properties",
//   "https://mintlr.guestybookings.com/properties",
//   "https://freedombnb.guestybookings.com/properties",
//   "https://qoin.guestybookings.com/properties",
//   "https://stayonthecape.guestybookings.com/properties",
//   "https://30agetaways.guestybookings.com/properties",
//   "https://mfthvacationrentals.guestybookings.com/properties",
//   "https://tropicalstays.guestybookings.com/properties",
//   "https://whisperingpalms.guestybookings.com/properties",
//   "https://futralenterprises.guestybookings.com/properties",
//   "https://stayherenl.guestybookings.com/properties",
//   "https://oasisvacationrentals.guestybookings.com/properties",
//   "https://loblollypines.guestybookings.com/properties",
//   "https://mattinosydneystays.guestybookings.com/properties",
//   "https://homerentality.guestybookings.com/properties",
//   "https://mistiqtemple.guestybookings.com/properties",
//   "https://bluebirdvr.guestybookings.com/properties",
//   "https://thebrooksmotel.guestybookings.com/properties",
//   "https://numfivemanagement.guestybookings.com/properties",
//   "https://seabreezedelray.guestybookings.com/properties",
//   "https://weekendermanagement.guestybookings.com/properties",
//   "https://urbanbutler.guestybookings.com/properties",
//   "https://alora.guestybookings.com/properties",
//   "https://mudra.guestybookings.com/properties",
//   "https://mitten.guestybookings.com/properties",
//   "https://sunflowerproperty.guestybookings.com/properties",
//   "https://blueskyvillage.guestybookings.com/properties",
//   "https://staymareni.guestybookings.com/properties",
//   "https://dreamaboardboatels.guestybookings.com/properties",
//   "https://stauntonstays.guestybookings.com/properties",
//   "https://capitalia.guestybookings.com/properties",
//   "https://divvystays.guestybookings.com/properties",
//   "https://stayplus.guestybookings.com/properties",
//   "https://huisjesaandeamstel.guestybookings.com/properties",
//   "https://jillys.guestybookings.com/properties",
//   "https://bnbescapes.guestybookings.com/properties",
//   "https://topchalets.guestybookings.com/properties",
//   "https://foxtailcabins.guestybookings.com/properties",
//   "https://families3.guestybookings.com/properties",
//   "https://parisconciergerie.guestybookings.com/properties",
//   "https://kozyrentals.guestybookings.com/properties",
//   "https://cameronescapes.guestybookings.com/properties",
//   "https://sif.guestybookings.com/properties",
//   "https://oceanstays.guestybookings.com/properties",
//   "https://stevensrentals.guestybookings.com/properties",
//   "https://thevalleycabins.guestybookings.com/properties",
//   "https://rockypointtom.guestybookings.com/properties",
//   "https://sunsetmotel.guestybookings.com/properties",
//   "https://casafilomeno.guestybookings.com/properties",
//   "https://airnme.guestybookings.com/properties",
//   "https://themillwaunakee.guestybookings.com/properties",
//   "https://advantehomes.guestybookings.com/properties",
//   "https://samsara.guestybookings.com/properties",
//   "https://nolaallthat.guestybookings.com/properties",
//   "https://dudu.guestybookings.com/properties",
//   "https://jennysretreats.guestybookings.com/properties",
//   "https://nolenvacations.guestybookings.com/properties",
//   "https://elysianvacations.guestybookings.com/properties",
//   "https://starsvacationhomes.guestybookings.com/properties",
//   "https://corasol.guestybookings.com/properties",
//   "https://ava.guestybookings.com/properties",
//   "https://carlin.guestybookings.com/properties",
//   "https://avalexperience.guestybookings.com/properties",
//   "https://villamaija.guestybookings.com/properties",
//   "https://vacationnosara.guestybookings.com/properties",
//   "https://orlandomagictownhouse.guestybookings.com/properties",
//   "https://staywestindies.guestybookings.com/properties",
//   "https://arkrentalsaz.guestybookings.com/properties",
//   "https://palmcrest.guestybookings.com/properties",
//   "https://saratogastays.guestybookings.com/properties",
//   "https://wehost.guestybookings.com/properties",
//   "https://urbanhideouts.guestybookings.com/properties",
//   "https://betterbnb.guestybookings.com/properties",
//   "https://cellardoorproperties.guestybookings.com/properties",
//   "https://getredyvacations.guestybookings.com/properties",
//   "https://poconospremierproperties.guestybookings.com/properties",
//   "https://urvita.guestybookings.com/",
//   "https://duvalpm.guestybookings.com/properties",
//   "https://namastays.guestybookings.com/properties",
//   "https://residencelecercle.guestybookings.com/properties",
//   "https://blackbird.guestybookings.com/properties",
//   "https://mycozygetaway.guestybookings.com/properties",
//   "https://813bnb.guestybookings.com/properties",
//   "https://destinationstays_mlh.guestybookings.com/properties",
//   "https://hideaway.guestybookings.com/properties",
//   "https://jdbnb.guestybookings.com/properties",
//   "https://isabelartemis.guestybookings.com/properties",
//   "https://riveroaks.guestybookings.com/properties",
//   "https://hardanger.guestybookings.com/properties",
//   "https://swankhouse.guestybookings.com/properties",
//   "https://bpg.guestybookings.com/properties",
//   "https://mistiqloscabos.guestybookings.com/properties",
//   "https://rankonestays.guestybookings.com/properties",
//   "https://freshairholidays.guestybookings.com/properties",
//   "https://martinvacationproperties.guestybookings.com/properties",
//   "https://canyondrivecostamesa.guestybookings.com/properties",
//   "https://residioapartments.guestybookings.com/properties",
//   "https://abkrentals.guestybookings.com/properties",
//   "https://amari.guestybookings.com/properties",
//   "https://slidetotheworld.guestybookings.com/properties",
//   "https://integritycorporatehousing.guestybookings.com/properties",
//   "https://unwindholidays.guestybookings.com/properties",
//   "https://melrose.guestybookings.com/properties",
//   "https://pillorooms.guestybookings.com/properties",
//   "https://luxvillas.guestybookings.com/properties",
//   "https://hsshproperties.guestybookings.com/properties",
//   "https://stsimonsbeachrentals.guestybookings.com/properties",
//   "https://arthouseabb.guestybookings.com/properties",
//   "https://staycolorado.guestybookings.com/properties",
//   "https://heritagehousecoosbay.guestybookings.com/properties",
//   "https://kildahlhouse.guestybookings.com/properties",
//   "https://thecountyestates.guestybookings.com/properties",
//   "https://bayside.guestybookings.com/properties",
//   "https://grandstrandgetaway.guestybookings.com/properties",
//   "https://hostini.guestybookings.com/properties",
//   "https://promcoastholidays.guestybookings.com/properties",
//   "https://historicsimmonsestate.guestybookings.com/properties",
//   "https://mikezvacations.guestybookings.com/properties",
//   "https://lafrenchcasa.guestybookings.com/properties",
//   "https://vareproperties.guestybookings.com/properties",
//   "https://yosemitebasslakesuites.guestybookings.com/properties",
//   "https://hotedegammevendee.guestybookings.com/properties",
//   "https://soquinomere.guestybookings.com/properties",
//   "https://frankiesays.guestybookings.com/properties",
//   "https://blackswanstay.guestybookings.com/properties",
//   "https://court_sejour_lyon_orpi.guestybookings.com/properties",
//   "https://bimbajong.guestybookings.com/properties",
//   "https://onefourtwo.guestybookings.com/properties",
//   "https://trinitysuites.guestybookings.com/properties",
//   "https://dahome.guestybookings.com/properties",
//   "https://stayhomy.guestybookings.com/properties",
//   "https://tinybsdfrancais.guestybookings.com/properties",
//   "https://grandesvillasdefrance.guestybookings.com/properties",
//   "https://homiesuites.guestybookings.com/properties",
//   "https://858properties.guestybookings.com/properties",
//   "https://moosevacationsllc.guestybookings.com/properties",
//   "https://brighton.guestybookings.com/properties",
//   "https://quin.guestybookings.com/properties",
//   "https://guestcottage.guestybookings.com/properties",
//   "https://masterknokke.guestybookings.com/properties",
//   "https://vistacaysuites.guestybookings.com/properties",
//   "https://vrpm.guestybookings.com/properties",
//   "https://seascapescottshead.guestybookings.com/properties",
//   "https://ozarkspringcabins.guestybookings.com/properties",
//   "https://typhuhomesvacationrentals.guestybookings.com/properties",
//   "https://picklefactory.guestybookings.com/properties",
//   "https://grandcanyontinyhomes.guestybookings.com/properties",
//   "https://bentonvillelodgingco.guestybookings.com/properties",
//   "https://amgroupproperties.guestybookings.com/properties",
//   "https://legacybnb.guestybookings.com/properties",
//   "https://ochotelgroup.guestybookings.com/properties",
//   "https://vectorstays.guestybookings.com/properties",
//   "https://hubcityhost.guestybookings.com/properties",
//   "https://lakechelanrentals.guestybookings.com/properties",
//   "https://amvacationrentals.guestybookings.com/properties",
//   "https://cohostedinburgh.guestybookings.com/properties",
//   "https://niagara.guestybookings.com/properties",
//   "https://bookregional.guestybookings.com/properties",
//   "https://mealermanagement.guestybookings.com/properties",
//   "https://staycationcuracao.guestybookings.com/properties",
//   "https://chesnutbayresort.guestybookings.com/properties",
//   "https://villagrenache.guestybookings.com/properties",
//   "https://funsunvacations.guestybookings.com/properties",
//   "https://authenticstays.guestybookings.com/properties",
//   "https://luxuryselfcatering.guestybookings.com/properties",
//   "https://oraklus.guestybookings.com/properties",
//   "https://eldersgoolwa.guestybookings.com/properties",
//   "https://smarthostvacationrentals.guestybookings.com/properties",
//   "https://vacastayusa.guestybookings.com/properties",
//   "https://secondhome.guestybookings.com/properties",
//   "https://apadapartments.guestybookings.com/properties",
//   "https://vra.guestybookings.com/properties",
//   "https://lazymoose.guestybookings.com/properties",
//   "https://thefourdaughters.guestybookings.com/properties",
//   "https://snugharbor.guestybookings.com/properties",
//   "https://espressohosting.guestybookings.com/properties",
//   "https://wharf703.guestybookings.com/properties",
//   "https://alamocitystays.guestybookings.com/properties",
//   "https://watersedges.guestybookings.com/properties",
// ];

// //eslint-disable-next-line import/no-anonymous-default-export
// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   process.on("unhandledRejection", (reason, promise) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//     // You can add additional debugging information here if needed
//   });
//   try {
//     let propertyData = {};

//     for (const url of urls) {
//       const browser = await puppeteer.launch({
//         // headless: false,
//         protocolTimeout: 4000000,
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
//       const newData = await scrapeUrl(browser, page, url, propertyData); // Retrieve data from scrapeUrl function
//       propertyData = { ...propertyData, ...newData };
//       console.log("done with ", url);
//       await browser.close();
//     }

//     await fs.writeFile("./scrape-data-new.json", JSON.stringify(propertyData));

//     res.status(200).json({ success: true, data: propertyData });
//   } catch (error) {
//     console.log("error here", error);
//     res.status(500).json({ success: false, error: "Scraping failed" });
//   }
// };

// async function scrapeUrl(
//   browser: Browser,
//   page: Page,
//   url: string,
//   propertyData: Record<string, any>,
// ) {
//   let tempData = propertyData;
//   const openedPages: Page[] = [];
//   // await page.goto(url, { waitUntil: "domcontentloaded" });
//   await page.goto(url);
//   await delay(3000);

//   async function scrollDownUntilNoChange(page: Page) {
//     let previousScrollHeight = 0;
//     let currentScrollHeight = -1;

//     while (previousScrollHeight !== currentScrollHeight) {
//       previousScrollHeight = currentScrollHeight;

//       try {
//         currentScrollHeight = await page.evaluate(async () => {
//           let element;

//           const overflowYScrollElement =
//             document.querySelector(".overflow-y-scroll");

//           await new Promise((resolve) => setTimeout(resolve, 1500));

//           if (overflowYScrollElement) {
//             element = overflowYScrollElement;
//           } else {
//             element = document.documentElement;
//           }
//           if (element) {
//             element.scrollTo(0, element.scrollHeight);
//           }
//           await new Promise((resolve) => setTimeout(resolve, 1500));
//           return element ? element.scrollHeight : -1;
//         });
//       } catch (err) {
//         console.log("error inside scroll", err);
//       }
//     }
//   }

//   // async function scrollDownUntilNoChange(page: Page) {
//   //   let previousScrollHeight = 0;
//   //   let currentScrollHeight = -1;

//   //   while (previousScrollHeight !== currentScrollHeight) {
//   //     previousScrollHeight = currentScrollHeight;

//   //     await page.evaluate(async () => {
//   //       const element = document.getElementsByClassName("overflow-y-scroll")[0];
//   //       if (element) {
//   //         element.scrollTo(0, element.scrollHeight);
//   //       }
//   //     });

//   //     await new Promise((resolve) => setTimeout(resolve, 2000));
//   //     currentScrollHeight = await page.evaluate(() => {
//   //       const element = document.getElementsByClassName("overflow-y-scroll")[0];
//   //       return element ? element.scrollHeight : -1;
//   //     });
//   //   }
//   // }

//   // Usage
//   await scrollDownUntilNoChange(page);

//   await delay(2000);

//   const numChildren = await page.evaluate(() => {
//     const div = document.querySelector('div[data-property-list="true"]');
//     return div ? div.children.length : 0;
//   });

//   console.log("Number of children:", numChildren);

//   let propertyNumber = 0;

//   const propertyData: {
//     images: (string | null)[];
//     text: (string | undefined)[];
//     dates: string[][];
//   }[] = [];

//   const handleNewPage = async (newPage: Page, propertyNumber: number) => {
//     await delay(3000);
//     try {
//       newPage.on("console", (msg) => {
//         for (let i = 0; i < msg.args().length; ++i) {
//           console.log(`${i}: ${msg.args()[i]}`);
//         }
//       });
//       const returnedData = await newPage.evaluate(
//         async (propertyNumber: number) => {
//           const slides = Array.from(
//             document.querySelectorAll(
//               'div[class*="mainSlider"] .slick-slide:not(.slick-cloned)',
//             ),
//           );
//           const numClicks = Math.min(60, slides.length - 1);

//           const arrow = document.getElementsByClassName("slick-next")[0];

//           for (let i = 0; i < numClicks; i++) {
//             arrow.click();
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//           }

//           const slickSlideDivs = document.querySelectorAll(
//             'div[class*="mainSlider"] .slick-slide:not(.slick-cloned) img',
//           );

//           const imageSources = Array.from(slickSlideDivs).map((img) =>
//             img.getAttribute("src"),
//           );

//           // expand amenities
//           const divWithShowAll = document.querySelector(
//             'div[class*="showAll"]',
//           );

//           // Check if the div element is found
//           if (divWithShowAll) {
//             // Trigger a click event on the div element
//             divWithShowAll.click();
//           } else {
//             console.log("Element with text 'Show all' not found.");
//           }

//           await new Promise((resolve) => setTimeout(resolve, 1000));

//           //grab all text
//           const propertyDescriptions = document.querySelectorAll(
//             '[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])',
//           );
//           let propertyTexts = Array.from(propertyDescriptions).map(
//             (description) => description.textContent?.trim(),
//           );
//           propertyTexts = propertyTexts.toString();

//           const titleEndIndex = propertyTexts.indexOf("Description");
//           const title = propertyTexts.substring(0, titleEndIndex);

//           // Extracting description
//           const descriptionStartIndex = titleEndIndex + "Description".length;
//           const descriptionEndIndex = propertyTexts.indexOf("Check in");
//           const description = propertyTexts.substring(
//             descriptionStartIndex,
//             descriptionEndIndex,
//           );

//           // Extracting check-in and check-out
//           const checkInIndex = propertyTexts.indexOf("Check in:");
//           const checkOutIndex = propertyTexts.indexOf("Check out:");
//           const checkIn = propertyTexts
//             .substring(checkInIndex + "Check in:".length, checkOutIndex)
//             .trim();
//           const checkOut = propertyTexts
//             .substring(
//               checkOutIndex + "Check out:".length,
//               propertyTexts.indexOf("Property features"),
//             )
//             .trim();

//           // Extracting property features
//           const propertyFeaturesStartIndex =
//             propertyTexts.indexOf("Property features");
//           const propertyFeaturesEndIndex =
//             propertyTexts.lastIndexOf("Amenities");
//           let propertyFeatures = propertyTexts
//             .substring(
//               propertyFeaturesStartIndex + "Property features".length,
//               propertyFeaturesEndIndex,
//             )
//             .trim();

//           if (propertyFeatures) {
//             propertyFeatures = propertyFeatures.replace(
//               /([a-zA-Z])(\d+(\.\d+)?)/g,
//               "$1, $2",
//             );
//           }

//           // Extracting amenities
//           const showAllDiv = document.querySelector('div[class*="showAll"]');
//           const brotherWithChildren = showAllDiv?.previousElementSibling;
//           const amenities = [];
//           if (brotherWithChildren) {
//             for (const childDiv of brotherWithChildren.children) {
//               // Push the text content of each child div into the array
//               amenities.push(childDiv.textContent?.trim());
//             }
//           }

//           return {
//             propertyNumber,
//             imageSources,
//             propertyTexts,
//             // allDates,
//             title,
//             description,
//             checkIn,
//             checkOut,
//             propertyFeatures,
//             amenities,
//           }; // Return property number and image sources
//         },
//         propertyNumber,
//       );

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
//           const returnedData = await handleNewPage(newPage, propertyNumber);

//           let bedrooms, beds, bathroom;

//           if (returnedData?.propertyFeatures) {
//             [bedrooms, beds, bathroom] =
//               returnedData.propertyFeatures.split(", ");
//           }

//           // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//           if (returnedData?.title) {
//             tempData[returnedData.title] = {
//               ...(tempData[returnedData.title] || {}),
//               title: returnedData.title,
//               images: returnedData.imageSources,
//               description: returnedData.description,
//               checkIn: returnedData.checkIn,
//               checkOut: returnedData.checkOut,
//               amenities: returnedData.amenities,
//               numBedrooms: bedrooms ? parseInt(bedrooms) : null, // Convert to integer if present
//               numBeds: beds ? parseInt(beds) : null, // Convert to integer if present
//               numBathroom: bathroom ? parseFloat(bathroom) : null,
//             };
//           }

//           //const parsedProperty = propertyInsertSchema.parse(propertyData);

//           console.log(
//             propertyNumber,

//           );
//           propertyNumber++;
//         } catch (err) {
//           console.log("error handling new page", err);
//         }
//       }
//     })();
//   });

//   try {
//     const propertiesData = await page.evaluate(async () => {
//       const element = document.querySelector('div[data-property-list="true"]');

//       // const element = document.querySelector(".overflow-y-scroll");
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
//           let propertyFooterSpan = div.querySelector(
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
//               parseFloat(
//                 propertyFooterSpan?.textContent
//                   .replace(/,/g, "")
//                   .trim()
//                   .slice(1),
//               ) * 100,
//           };
//           if (propertyTitle) {
//             data[propertyTitle] = propertyData;
//           }
//         }
//       }
//       return data;
//     });
//     tempData = propertiesData;
//   } catch (err) {
//     console.log("error in original page ", err);
//   }

//   try {
//     await page.evaluate(async () => {
//       // const element = document.querySelector(".overflow-y-scroll");
//       //await new Promise((resolve) => setTimeout(resolve, 2000));
//       let element = document.querySelector(".overflow-y-scroll");
//       if (!element) {
//         element = document.querySelector('div[data-property-list="true"]');
//       }

//       if (element) {
//         const divs = Array.from(element.children) as HTMLElement[];

//         const batchSize = 10;
//         const totalBatches = Math.ceil(divs.length / batchSize);

//         for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
//           const startIndex = batchIndex * batchSize;
//           const endIndex = Math.min(startIndex + batchSize, divs.length);

//           for (let i = startIndex; i < endIndex; i++) {
//             const bookNowButton = divs[i]?.querySelector(
//               '[data-qa="book-now"]',
//             );
//             if (bookNowButton) {
//               bookNowButton.dispatchEvent(
//                 new MouseEvent("click", { bubbles: true, button: 1 }),
//               );

//               console.log("testlklk");
//               await new Promise((resolve) => setTimeout(resolve, 2000));

//               console.log("laksdfkl");
//             }
//           }

//           // If it's not the last batch, add a 30-second delay
//           if (batchIndex < totalBatches - 1) {
//             console.log("Waiting for 60 seconds before the next batch...");
//             const timeout = 50000;
//             const startTime = Date.now();
//             while (Date.now() - startTime < timeout) {
//               await new Promise((resolve) => setTimeout(resolve, 1000));
//             }
//           }
//         }
//       }
//     });
//   } catch (err) {
//     console.log("error in page evaluate", err);
//   }

//   console.log("here");
//   try {
//     // const waitForPagesToClose = async () => {
//     //   while (openedPages.length > 0) {
//     //     await delay(1000); // Add a delay to prevent busy waiting
//     //   }
//     //   console.log("All opened pages closed");
//     // };

//     const waitForPagesToClose = async () => {
//       // while (openedPages.length > 0) {
//       console.log("pages:", openedPages.length);
//       await delay(20000); // Add a delay to prevent busy waiting
//       // }
//       console.log("All opened pages closed");
//     };
//     // Your existing code here...

//     await waitForPagesToClose();
//   } catch (err) {
//     console.log("err after the page.eval", err);
//   }
//   return tempData;
// }

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
