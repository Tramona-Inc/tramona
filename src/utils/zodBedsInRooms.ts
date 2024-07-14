import { ALL_BED_TYPES, type BedsInRooms } from "@/server/db/schema";
import { z } from "zod";

/**
 * for each line, it parses a string like this:
 * 1 Twin Bed, 2 Twin XL Bed
 * into an array of objects like this:
 * [{ count: 1, type: "Twin" }, { count: 2, type: "Twin XL" }]
 */
export const zodBedsInRooms: z.ZodType<BedsInRooms, z.ZodTypeDef, string> = z
  .string()
  .trim()
  .transform((s) =>
    s.split("\n").map((s) => s.split(",").map(parseBedTypeAndCount)),
  )
  .pipe(
    z
      .object({
        count: z.number().int().positive(),
        type: z.enum(ALL_BED_TYPES, {
          errorMap: (_, ctx) => ({
            message: `Unsupported bed type "${ctx.data}"`,
          }),
        }),
      })
      .array()
      .array(),
  );

/**
 * does the opposite of zodBedsInRooms, turning the parsed bedsInRooms into a string
 */
export function stringifyBedsInRooms(bedsInRooms: BedsInRooms) {
  return bedsInRooms
    .map((room) => room.map(({ count, type }) => `${count} ${type}`).join(", "))
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
