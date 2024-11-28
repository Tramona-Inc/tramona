import { db } from "@/server/db";
import { bookedDates } from "@/server/db/schema";
import { lt } from "drizzle-orm";

export default async function handler() {
  await db.delete(bookedDates).where(lt(bookedDates.date, new Date()));
}

await handler();
process.exit(1);
