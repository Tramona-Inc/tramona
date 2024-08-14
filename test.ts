import { scrapeAirbnbListings } from "@/server/external-listings-scraping/scrapeAirbnbListings";

await scrapeAirbnbListings({
  checkIn: new Date("2024-08-01"),
  checkOut: new Date("2024-08-05"),
  numGuests: 2,
  location: "Paris",
  maxTotalPrice: 1000,
  id: 123,
}).then(console.log);
