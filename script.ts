import { db } from "@/server/db";
import { referralCodes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/server/server-utils";
import WelcomeEmail from "packages/transactional/emails/WelcomeEmail";
import WelcomeHostEmail from "packages/transactional/emails/WelcomeHostsEmail";
import { createInstantlyCampaign } from "@/utils/outreach-utils";
import { getCoordinates } from "@/server/google-maps";
import { formatDateRange } from "@/utils/utils";

async function handler() {
  // Get coordinates for a test location
  const location = await getCoordinates("San Francisco, CA, USA");
  if (!location.location) {
    console.error("Location not found");
    return;
  }

  // Create a test campaign with more detailed options
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 3); // 3-day stay

  // Create campaign with all available options
  const campaignId = await createInstantlyCampaign({
    campaignName: "Test Booking Request: San Francisco",
    locationFilter: {
      lat: location.location.lat,
      lng: location.location.lng,
      radiusKm: 15,  // 15km radius
    },
    maxLeads: 50,  // Limit to 50 leads
    skipRecentlyContacted: true,
    customVariables: {
      requestLocation: "San Francisco, CA, USA",
      requestId: "test-1234",
      checkInDate: startDate.toISOString(),
      checkOutDate: endDate.toISOString(),
      numGuests: 2,
      pricePerNight: 150,
      totalPrice: 450,
      numNights: 3,
      bookingURL: "https://tramona.com/booking/test-1234"
    },
    scheduleOptions: {
      startTime: "10:00",
      endTime: "18:00",
      timezone: "America/Los_Angeles",
      startDate: new Date()
    }
  });

  console.log(`Campaign created with ID: ${campaignId ?? "Failed to create campaign"}`);
}

await handler();
process.exit(1);