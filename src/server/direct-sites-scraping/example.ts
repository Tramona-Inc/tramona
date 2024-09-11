import { DirectSiteScraper } from ".";

// the json will either be in some endpoint, or in a script tag in the html of the page.
//   For script tags:
//     1. use scrapeUrl to fetch and parse html and get the script tag(s)
//     2. use json.parse to get the json
//     3. validate/parse the json with zod
//   For the endpoint:
//     1. use axois.get(url, { httpsAgent: proxyAgent }) to get the json directly
//     2. validate/parse the json with zod

export const exampleScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
}) => {
  // 1. fetch the top level search page/landing page with previews of all the properties,
  //    filtered by checkIn and checkOut
  // 2. if its paginated, try to get the urls of each page, and then fetch them all
  //    in parallel (Promise.all), otherwise fetch 1 page at a time
  // 3. get an array of urls/ids of each property and fetch the pages (or json endpoints) in parallel
  // 4. parse out and return the data 😃
  return [];
};
