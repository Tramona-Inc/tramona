import { scrapeAirbnbSearch } from "@/server/external-listings-scraping/airbnbScraper";
import { writeFile } from "fs/promises";

await scrapeAirbnbSearch({
  checkIn: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  checkOut: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
  location: "New York, NY",
  numGuests: 2,
}).then((r) => writeFile("res.json", JSON.stringify(r, null, 2)));
