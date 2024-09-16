import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Loop to simulate a task running every 5 seconds for 1 minute
    for (let i = 0; i < 12; i++) {
      // Your task logic here (e.g., scraping, data processing, etc.)
      console.log(`Running task iteration ${i + 1}`);

      // Simulate a 5-second delay
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    res.status(200).json({ message: "Task executed with 5-second intervals" });
  } catch (error) {
    console.error("Error executing task2:", error);
    res.status(500).json({ error: "Task execution failed" });
  }
}