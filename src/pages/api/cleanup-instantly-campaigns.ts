import { env } from "@/env";
import { addDays, isBefore } from "date-fns";

/**
 * Cleans up old Instantly.ai campaigns that are:
 * 1. Completed (all emails sent)
 * 2. Older than 2 days
 * 3. Have no pending emails
 */
export async function cleanupInstantlyCampaigns() {
  if (!env.INSTANTLY_API_KEY) {
    console.error("INSTANTLY_API_KEY is not configured");
    return;
  }

  try {
    // Get all campaigns
    const campaignsResponse = await fetch("https://api.instantly.ai/api/v2/campaigns", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!campaignsResponse.ok) {
      throw new Error(`Failed to fetch campaigns: ${await campaignsResponse.text()}`);
    }

    const campaigns = await campaignsResponse.json() as Array<{
      id: string;
      name: string;
      created_at: string;
      status: string;
      pending_count: number;
    }>;

    const twoDaysAgo = addDays(new Date(), -2);
    let deletedCount = 0;
    let errorCount = 0;

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        const campaignDate = new Date(campaign.created_at);

        // Check if campaign is old enough and has no pending emails
        if (isBefore(campaignDate, twoDaysAgo) &&
          campaign.pending_count === 0 &&
          campaign.status !== "running") {

          // Delete the campaign
          const deleteResponse = await fetch(`https://api.instantly.ai/api/v2/campaigns/${campaign.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${env.INSTANTLY_API_KEY}`,
              "Content-Type": "application/json",
            },
          });

          if (deleteResponse.ok) {
            console.log(`Successfully deleted campaign ${campaign.id} (${campaign.name})`);
            deletedCount++;
          } else {
            console.error(`Failed to delete campaign ${campaign.id}: ${await deleteResponse.text()}`);
            errorCount++;
          }
        }
      } catch (err) {
        console.error(`Error processing campaign ${campaign.id}:`, err);
        errorCount++;
      }
    }

    console.log(`Cleanup complete. Deleted ${deletedCount} campaigns. Encountered ${errorCount} errors.`);
  } catch (err) {
    console.error("Error in cleanupInstantlyCampaigns:", err);
  }
}