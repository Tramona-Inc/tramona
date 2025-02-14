import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendEmail } from "@/server/server-utils";
import RequestOutreachEmail from "packages/transactional/emails/RequestOutreachEmail";
import { db } from "@/server/db";
import { eq } from "drizzle-orm"; // Import 'eq' for database queries
import {
  PropertyManagerContact,
  propertyManagerContacts,
} from "@/server/db/schema";

interface OllamaStreamChunk {
  model?: string;
  created_at?: string;
  response?: string;
  done?: boolean;
  [key: string]: any;
}

interface NeighborhoodType {
  city: string;
  state: string | null;
  postcode: string | null;
}

export const aiRouter = createTRPCRouter({
  makeOllamaCall: publicProcedure
    .input(
      z.object({
        requestLocation: z.string(),
        prompt: z.string(), // You might remove this later as prompt is constructed in backend
        requestedLocationLatLng: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
        radius: z.number().optional(), // You might remove radius from input as prompt is radius-free now
      }),
    )
    .mutation(
      async ({ input }) => {
        if (!input.requestedLocationLatLng) return;
        let fullResponseText = "";
        let thinkContent = "";
        let identifiedCityName: string | null = null; // Variable to store identified city name

        // < _______________________________________________________  OLLAMA CALL _______________________________________________________ >
        // try {
        //   console.log("Input to makeOllamaCall:", input); // Log input for debugging

        //   // --- 1. Call Ollama API ---
        //   const ollamaResponse = await fetch(
        //     "http://localhost:11434/api/generate",
        //     {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         model: "DeepSeek-r1",
        //         prompt: getPromptWithLatLngValues(
        //           // Using the updated prompt
        //           input.requestedLocationLatLng.lat,
        //           input.requestedLocationLatLng.lng,
        //         ),
        //         temperature: 0.1, // Keep temperature low for focused output
        //       }),
        //     },
        //   );

        //   if (!ollamaResponse.ok) {
        //     console.error(
        //       "Ollama API Error:",
        //       ollamaResponse.status,
        //       ollamaResponse.statusText,
        //     );
        //     throw new TRPCError({
        //       code: "INTERNAL_SERVER_ERROR",
        //       message: "Error calling Ollama API",
        //       cause: `Ollama API responded with status ${ollamaResponse.status} ${ollamaResponse.statusText}`,
        //     });
        //   }

        //   // --- 2. Process ReadableStream --- (Stream processing remains the same)
        //   if (ollamaResponse.body) {
        //     // ... (ReadableStream processing code - unchanged from previous robust version) ... }

        //     // --- 3. Extract <think> content and clean fullResponseText --- (Think tag extraction - unchanged)
        //     const thinkTagRegex = /<think>(.*?)<\/think>/gs; // ... (Think tag regex and extraction - unchanged) ... }

        //     const cleanedResponseText = fullResponseText
        //       .replace(thinkTagRegex, "")
        //       .trim();

        //     console.log(fullResponseText);

        //     // --- 4. Robust JSON Parsing: Split and Parse Objects --- (Robust JSON parsing - unchanged)
        //     const suggestedNeighborhoods: NeighborhoodType[] = []; // ... (Robust JSON parsing loop - unchanged) ... }

        //     if (suggestedNeighborhoods.length === 0) {
        //       // Check for empty neighborhoods - unchanged
        //       console.log("Ollama did not return any valid neighborhoods."); // ... (Error handling for no neighborhoods - unchanged) ... }

        //       // --- 5. Extract IDENTIFIED CITY NAME from the FIRST object in suggestedNeighborhoods ---
        //       if (
        //         suggestedNeighborhoods[0]
        //       ) {
        //         identifiedCityName = suggestedNeighborhoods[0].city; // Extract city from the FIRST object
        //         console.log("Identified City Name from AI:", identifiedCityName); // Log identified city
        //       } else {
        //         console.warn("Warning: No city name identified by AI."); // Warn if no city name found
        //         identifiedCityName = null; // Set to null if not found
        //      }

        // <---------------------------------------------------- METHOD 2: Find appropriate cities

        // <-----------------------------------------------------RETRIEVE EMAILS - FILTERED BY CITY------------------------------------>
        let managers: PropertyManagerContact[] = []; // Initialize managers array
        if (identifiedCityName) {
          // Only query if we have a city name
          managers = await db.query.propertyManagerContacts
            .findMany({
              where: eq(propertyManagerContacts.city, identifiedCityName), // ✅ FILTER MANAGERS BY CITY NAME
            })
            .then((res) =>
              res.map((manager) => ({ ...manager, email: manager.email! })),
            );
          console.log(
            `Found ${managers.length} managers in city: ${identifiedCityName}`,
          ); // Log number of managers found
        } else {
          console.warn("Skipping database query - No city name identified."); // Warn if skipping query
        }
        //console.log(cleanedResponseText);
        console.log("Managers to email:", managers); // Log managers to be emailed
        // <------------------------------------------------------- EMAIL SECTION -------------------------------------------------->

        for (const manager of managers) {
          if (!manager.email) return;
          await sendEmail({
            // Email sending loop - unchanged
            to: manager.email,
            subject: `${manager.propertyManagerName} Potential Travelers looking for a stay in ${input.requestLocation}`,
            content: RequestOutreachEmail({
              requestLocation: input.requestLocation, // Email content still uses requestLocation for now
            }),
          });
        }

        return {
          suggestedNeighborhoods: suggestedNeighborhoods, // Return array of neighborhoods (including city as first element)
          think: thinkContent.trim(), // Return think content
          identifiedCity: identifiedCityName, // Return identified city name in the response
          emailedManagerCount: managers.length, // Return the count of emailed managers
        };
      },
      //   }
      // }
      // catch (error) {
      //   // Error handling - unchanged
      //   console.log(error);
      // }
    ),
});

function getPromptWithLatLngValues(latitude: number, longitude: number) {
  return `FOR THE GIVEN GEOGRAPHIC LOCATION (Latitude: ${latitude}, Longitude: ${longitude}):

**DEFINE "CITY" and "NEIGHBORHOOD" for this task:**

*   **CITY:**  Think of a "city" as a larger, incorporated municipality with its own distinct name (e.g., "Los Angeles", "New York City", "Chicago", "Paris", "London"). Cities often contain multiple neighborhoods within them.
*   **NEIGHBORHOOD:** Think of a "neighborhood" as a smaller, locally recognized district, area, or section *within* a city. Neighborhoods are usually not independent municipalities but are parts of a larger city (e.g., "Hollywood" in Los Angeles, "Manhattan" in New York City, "Lincoln Park" in Chicago, "Le Marais" in Paris, "Soho" in London).  A neighborhood is *part of* a city.

**YOUR PRIMARY GOAL IS TO RETURN A LIST OF NEIGHBORHOODS, AND ONLY NEIGHBORHOODS.**  DO NOT RETURN CITIES THEMSELVES (unless a city name is also commonly used as a neighborhood name *within another, larger city* - this is rare, so generally, avoid returning city names directly).

**INPUT LOCATION IS TREATED AS A CITY:** Assume the provided Latitude and Longitude represent a CITY.  In this case:
*   Return a JSON array that **STARTS WITH THE NAME OF THE INPUT CITY ITSELF as the FIRST OBJECT in the array** (using the "city" key in the JSON object - see example format below).
*   **FOLLOWED BY:** A comprehensive list of **major and ALL RELEVANT NEIGHBORHOODS OR SECTIONS *WITHIN* THIS INPUT CITY**.
*   **DO NOT INCLUDE NEIGHBORHOODS FROM OTHER CITIES**. Focus on neighborhoods *within* the input city.
*   **DO NOT INCLUDE BORDERING CITIES THEMSELVES**. Focus on neighborhoods *within* the input city.

**INPUT LOCATION IS TREATED AS A NEIGHBORHOOD:** If the given location is already clearly identifiable as a NEIGHBORHOOD (though you are receiving city-level coordinates), then:
*   Return a JSON array that **STARTS WITH THE NAME OF THE INPUT NEIGHBORHOOD ITSELF as the FIRST OBJECT in the array** (using the "city" key - see example format below).
*   **FOLLOWED BY:** A comprehensive list of **major and ALL RELEVANT NEARBY NEIGHBORHOODS** that are **WITHIN THE *SAME CITY* as the INPUT NEIGHBORHOOD**.
*   **DO NOT INCLUDE NEIGHBORHOODS FROM *OTHER CITIES***. Focus exclusively on neighborhoods *within the same city* as the input neighborhood.

**FOR ALL SUGGESTIONS (whether city or neighborhood input):**

*   **Prioritize neighborhoods that are GEOGRAPHICALLY CENTRAL and REPRESENTATIVE of the city or input neighborhood.**
*   **Ensure all returned neighborhoods are *distinct* and *non-overlapping* as much as possible.** Avoid redundancy.
*   **If possible, ensure all neighborhoods are within the same primary administrative region** (like a state, province, or similar top-level administrative division) as the main city.

Return your response as a **pure JSON array of objects** (and nothing else). The **FIRST OBJECT in the array MUST ALWAYS BE THE INPUT CITY NAME or INPUT NEIGHBORHOOD NAME (depending on input type)**, followed by the list of suggested neighborhoods. Each object in the array should have the following keys:

*   **city**: The name of the neighborhood or section (String).  Use the most common or locally recognized name.
*   **state**: The state, province, or similar top-level administrative division abbreviation (String, Optional - can be null if not applicable or not clearly known for locations outside of countries with states/provinces).
*   **postcode**: The zip code or postal code (String, Optional - can be null if not applicable or not easily available for the location).

**Example JSON Output Format (Array of Objects - starting with input city/neighborhood, then neighborhoods within the same city):**

\`\`\`json
[
  {
    "city": "[INPUT CITY NAME or INPUT NEIGHBORHOOD NAME]",  // FIRST OBJECT is always the input location name
    "state": "[State/Province Abbreviation]", // State of the input location
    "postcode": "[Postal Code]"  // Postcode of the input location
  },
  {
    "city": "[Neighborhood Name 1 - WITHIN SAME CITY]",
    "state": "[State/Province Abbreviation]",
    "postcode": "[Postal Code]"
  },
  {
    "city": "[Neighborhood Name 2 - WITHIN SAME CITY]",
    "state": "[State/Province Abbreviation]",
    "postcode": "[Postal Code]"
  },
  // ... more neighborhood objects WITHIN THE SAME CITY ...
]
\`\`\`

Do not include any introductory phrases, explanations, or extra text outside of the JSON array. Just the JSON array.

For large cities, **aim to provide a comprehensive list of at least 20-25 major neighborhoods or sections, ALL GUARANTEED to be within the SAME CITY**. For medium-sized cities, aim for at least 10-15, ALL WITHIN THE SAME CITY. For small cities, try to get at least 5, ALL WITHIN THE SAME CITY. If it's an isolated town and there are genuinely very few neighborhoods truly within the same city, listing fewer is acceptable if no closer neighborhoods are genuinely available within that same city.  **QUALITY AND "SAME CITY" CONSTRAINT ARE PARAMOUNT - ONLY RETURN NEIGHBORHOODS THAT ARE ACTUALLY AND UNDOUBTEDLY WITHIN THE SAME CITY.**

**FAILURE IS ABSOLUTELY UNACCEPTABLE if ANY SUGGESTION IS FROM A *DIFFERENT CITY* (no neighborhoods from other cities allowed). Focus 100% ENTIRELY on returning neighborhoods that are GEOGRAPHICALLY WITHIN the SAME CITY as the input location and are *NEIGHBORHOODS*, not just cities.**`;
}
export type OllamaRouter = typeof aiRouter;
