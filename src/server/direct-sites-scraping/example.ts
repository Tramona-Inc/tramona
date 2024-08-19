import { DirectSiteScraper } from ".";

export const exampleScraper: DirectSiteScraper = async () => {
  // 1. fetch the top level search page/landing page with previews of all the properties
  // 2. if its paginated, try to get the urls of each page, and then fetch them all
  //    in parallel (Promise.all), otherwise fetch 1 page at a time
  // 3. get an array of urls/ids of each property and fetch the pages (or json endpoints) in parallel
  // 4. parse out and return the data 😃
  return [];
};
