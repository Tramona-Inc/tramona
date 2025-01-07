import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "@/server/db"; // Adjust this to your actual database utility
import { hostTeamMembers } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get session data
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Access the user's ID from the session
  const userId = session.user.id;

  // Example: Query the database for the host team's data for this user
  try {
    const hostTeam = await db.query.hostTeamMembers
      .findMany({
        where: eq(hostTeamMembers.userId, userId),
        orderBy: [desc(hostTeamMembers.addedAt)],
      })
      .then((res) => res[0]?.hostTeamId);

    console.log(hostTeam);

    if (hostTeam) {
      return res.status(200).json(hostTeam);
    } else {
      return res.status(404).json({ message: "Host team not found" });
    }
  } catch (error) {
    console.error("Error fetching host team:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
