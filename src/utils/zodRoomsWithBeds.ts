import { ALL_BED_TYPES, type RoomWithBeds } from "@/server/db/schema";
import { z } from "zod";

/**
 * for each line, it parses a string like this:
 * Master bedroom: 1 Twin Bed, 2 Twin XL Bed
 * into an object like this:
 * ```js
 * {
 *   roomName: "Master bedroom",
 *   beds: [{ count: 1, type: "Twin" }, { count: 2, type: "Twin XL" }],
 * }
 * ```
 */
export const zodRoomsWithBedsParser: z.ZodType<
  RoomWithBeds[],
  z.ZodTypeDef,
  string
> = z
  .string()
  .trim()
  .transform((s) =>
    s
      .split("\n")
      .filter(Boolean)
      .map((s) => s.split(":"))
      .filter((arr): arr is [string, string] => arr.length === 2)
      .map(([name, beds]) => ({
        name,
        beds: beds.split(",").map(parseBedTypeAndCount),
      })),
  )
  .pipe(
    z
      .object({
        name: z
          .string()
          .trim()
          .min(1, { message: "Room name cannot be empty" }),
        beds: z
          .object({
            count: z.number().int().positive(),
            type: z.enum(ALL_BED_TYPES, {
              errorMap: (_, ctx) => ({
                message: `Unsupported bed type "${ctx.data}"`,
              }),
            }),
          })
          .array(),
      })
      .array(),
  );

/**
 * does the opposite of zodBedsInRooms, turning the parsed bedsInRooms into a string
 */
export function stringifyRoomsWithBeds(rooms: RoomWithBeds[]) {
  return rooms
    .map(
      (room) =>
        `${room.name}: ${room.beds.map((bed) => `${bed.count} ${bed.type}`).join(", ")}`,
    )
    .join("\n");
}

function parseBedTypeAndCount(s: string) {
  s = s.trim();
  const i = s.indexOf(" ");
  const countStr = s.slice(0, i);
  const typeStr = s.slice(i + 1).trim();
  return {
    count: parseFloat(countStr),
    type: findBedType(typeStr) ?? typeStr,
  };
}

function findBedType(input: string) {
  input = input.toLowerCase().replaceAll(" ", "");

  return ALL_BED_TYPES.find((bedType: string) => {
    bedType = bedType.toLowerCase().replaceAll(" ", "");
    return bedType === input || bedType === `${input}bed`;
  });
}
