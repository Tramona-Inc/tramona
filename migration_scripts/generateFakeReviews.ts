// =======================================================
// Imports & Setup
// =======================================================
import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { reviews, reviewsInsertSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createUserNameAndPic } from "@/components/activity-feed/admin/generationHelper";
import * as fs from "node:fs/promises";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const maxTokensToUse = 10000;
let tokensUsed = 0;

const googleApiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(googleApiKey ?? ""); //Added a nullish coalescing operator
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Use Gemini 1.5 Flash

// =======================================================
// Load Templates and Configuration
// =======================================================
let namesAndPics: { name: string; picture: string }[] = [];
let allNamesAndPicsGenerated: boolean = false;
const maxReviewLength: number = 600;
const minReviewLength: number = 30;
const reviewParagraphMax: number = 3;
const emojis: string[] = [
  "😊",
  "👍",
  "👎",
  "❤️",
  "😂",
  "😎",
  "🤔",
  "😴",
  "😍",
  "🤩",
  "🥳",
  "💯",
  "🔥",
  "✨",
  "🌟",
];

// =======================================================
// Helper Functions
// =======================================================
function generateRandomDate(daysAgo = 365): string {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysAgo));
  return pastDate.toISOString().slice(0, 10);
}
const generateRandomBoolean = (probability: number): boolean => {
  return Math.random() < probability;
};
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

async function getAllNamesAndPics(): Promise<
  { name: string; picture: string }[]
> {
  if (allNamesAndPicsGenerated) {
    return namesAndPics;
  }
  console.time("getAllNamesAndPics");
  namesAndPics = await createUserNameAndPic(1000);
  console.timeEnd("getAllNamesAndPics");
  allNamesAndPicsGenerated = true;
  return namesAndPics;
}
const ratingRandomizer = (): number => {
  const randomNumber = Math.random();
  if (randomNumber < 0.1) {
    // 10% chance
    return Math.floor(Math.random() * 2) + 1; // 1 or 2
  } else if (randomNumber < 0.25) {
    // 15% chance
    return 3;
  } else if (randomNumber < 0.45) {
    // 20% chance
    return 4;
  } else {
    return 5; // The rest is mostly 5-star.
  }
};

// =======================================================
// Template Based Review Generation
// =======================================================
async function generateRandomReview(
  rating: number,
  city: string,
): Promise<string | null> {
  let reviewTemplates;
  try {
    const citySpecificTemplateData = await fs.readFile(
      `./cities/${city.toLowerCase().replace(/\s+/g, "")}.json`,
      "utf-8",
    );
    reviewTemplates = JSON.parse(citySpecificTemplateData) as {
      positive: { template: string }[];
      negative: { template: string }[];
      neutral: { template: string }[];
      positiveAdjective1: string[];
      positiveAdjective2: string[];
      positiveVerb: string[];
      positiveCleanliness: string[];
      negativeAdjective1: string[];
      negativeAdjective2: string[];
      negativeVerb: string[];
      negativeCleanliness: string[];
      negativeEmotion: string[];
      positiveExperienceAdjective: string[];
      negativeExperienceAdjective: string[];
      neutralExperienceAdjective: string[];
      neutralAdjective: string[];
      cityLocation: string[];
      cityFood: string[];
      cityExperience: string[];
      nouns: string[];
      secondNoun: string[];
    };
  } catch (error) {
    console.error(`No template found for city ${city}`);
    return null;
  }
  const templates =
    rating <= 2
      ? reviewTemplates.negative
      : rating === 3
        ? reviewTemplates.neutral
        : reviewTemplates.positive;
  const template =
    templates[Math.floor(Math.random() * templates.length)]?.template;
  let review = template ?? "";
  for (const key of Object.keys(reviewTemplates)) {
    if (key === "negative" || key === "positive" || key === "neutral") {
      continue;
    }
    const regex = new RegExp(`{${key}}`, "g");
    if (template && template.includes(`{${key}}`)) {
      const replacement =
        reviewTemplates[key as keyof typeof reviewTemplates][
          Math.floor(
            Math.random() *
              reviewTemplates[key as keyof typeof reviewTemplates].length,
          )
        ];
      review = review.replace(regex, () => {
        if (typeof replacement === "string") {
          return replacement;
        } else if (
          replacement &&
          typeof replacement === "object" &&
          "template" in replacement
        ) {
          return replacement.template;
        }
        return "";
      });
    }
  }

  // Inject "human-like" phrases and details
  review = `${review}${generateHumanLikePhrases()}`;
  // Adjust review length and structure
  review = adjustReviewLength(review);
  // Add emojis for fun
  review = `${review} ${generateEmojis()}`;
  return review;
}
const generateHumanLikePhrases = (): string => {
  const phrases: string[] = [];
  if (Math.random() < 0.5) {
    phrases.push(Math.random() < 0.5 ? "Honestly, " : "To be honest, ");
  }
  if (Math.random() < 0.3) {
    phrases.push(
      Math.random() < 0.5 ? "I was pleasantly surprised." : "Overall, ",
    );
  }
  if (Math.random() < 0.3) {
    phrases.push(
      Math.random() < 0.5
        ? "It was a bit of a shame that..."
        : "We would definitely return.",
    );
  }
  if (Math.random() < 0.3 && Math.random() < 0.5) {
    phrases.push(
      generateRandomBoolean(0.5) ? "Would recommend" : "Would not recommend",
    );
  }
  if (phrases.length === 0) {
    return "";
  }
  return " " + phrases.join(" ");
};
const adjustReviewLength = (review: string): string => {
  const reviewLength = review.split(" ").length;
  if (reviewLength > maxReviewLength) {
    const reviewArr = review.split(" ");
    return reviewArr.slice(0, maxReviewLength).join(" ");
  }
  if (reviewLength < minReviewLength) {
    const numWordsToAdd = generateRandomNumber(
      minReviewLength - reviewLength,
      minReviewLength * 0.7,
    );
    const fillerWords = [
      "and",
      "a",
      "is",
      "was",
      "were",
      "we",
      "they",
      "the",
      "this",
      "it",
      "that",
      "but",
      "or",
      "so",
    ];
    for (let i = 0; i < numWordsToAdd; i++) {
      const randomIndex = Math.floor(Math.random() * fillerWords.length);
      review += ` ${fillerWords[randomIndex]}`;
    }
    if (review.split(" ").length < minReviewLength) {
      return review + " " + "This stay was ok.";
    }
  }
  let reviewWithParagraphs: string = "";
  const reviewArr = review.split(" ");
  const numberOfParagraphs = generateRandomNumber(1, reviewParagraphMax);
  let chunkSize = Math.floor(reviewArr.length / numberOfParagraphs);
  for (let p = 0; p < numberOfParagraphs; p++) {
    const paragraphStart = p * chunkSize;
    const paragraphEnd = (p + 1) * chunkSize;
    let paragraph = reviewArr.slice(paragraphStart, paragraphEnd).join(" ");
    if (p === numberOfParagraphs - 1) {
      paragraph = reviewArr.slice(paragraphStart).join(" ");
    }
    reviewWithParagraphs += `${paragraph} \n \n `;
  }
  return reviewWithParagraphs.trim();
};
const generateEmojis = (): string => {
  if (Math.random() < 0.3) {
    const numberOfEmojis = generateRandomNumber(1, 3);
    const chosenEmojis: string[] = [];
    for (let i = 0; i < numberOfEmojis; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      if (emoji) {
        chosenEmojis.push(emoji);
      }
    }
    return chosenEmojis.join("");
  }
  return "";
};
// =======================================================
// LLM Based Review Generation
// =======================================================
const prompt = `You are a helpful assistant that generates realistic reviews for a booking website.
Reviews should be varied in length, sentiment, and should be about all kinds of topics including cleanliness, amenities, communication, location etc. The property is located in {city}. Consider the location when writing the reviews.
Here are some examples of how reviews should be written:
Review 1:
DO NOT WASTE YOUR MONEY! Where to start? First of all the owner is a crook. My grandmother and I booked 6 nights here and could not make it 3. The facilities were dirty, rundown, and the area was dangerous. The owner offered us a different room but tried to scam us for another $175! Then another manager allowed us to change rooms because of construction happening right next to us (which was not mentioned), and again the owner demanded to get more money from us. When my grandmother complained the owner simply said, “if you don’t like it then you can leave and I’ll refund you for the nights you didn’t stay”. That was 2 weeks ago and we still have not received our refund. I have called the owner many times and each time he assures me my money is on the way, after he acts like he doesn’t remember what I’m talking about.
Please do not ruin your trip by staying here. Don’t be fooled by the low price. You will suffer in the long run. When you complain to the owner he simply says, “that’s why we have 2 stars…you can write whatever review you want, but it’s the rate that is important”.
Don’t prove him right and take your business elsewhere!
Review 2:
Good
Review 3:
Great location with beautiful beach and decent snorkeling. Only issue was missing basic essentials: Blankets for bunk beds, soap for the bathroom, wash cloths, paper towels for the kitchen, cooking utensils towels for the pool.
Review 4:
Pool area it’s fantastic really nice place to relax warm water… nice place for couples
Review 5:
We booked this through Expedia for 3 people, I talked to the manager of this inn and mentioned that we in fact had three adults staying there.  Once arrived, there was one bed and the other was brought via pickup truck.  Asked for towels and tiolet paper and none were brought, internet was not working with the provided password, and the television was not working.  Pictures do not match the description.
Review 6:
The pool is not safe- slippery and there’s nothing guarding you from falling straight off the side into the rocks. No railing on the steps. No wi-fi. Broken blinds. Microwave didn’t work. Dirty bathroom sink. Heard cars all night. Old bedding, smells like mold, cleaning supplies left in the room. Some rooms were used for storing home improvement items. Wasn’t anyone here to greet me, but he showed up for the next people. Ok location, will need a car, some parking available. Not worth the money at all. If it was $60 a night then I could understand why things are run down- but they’re charging twice as much and I don’t see why. Don’t recommend not kid safe. Water in front of the hotel room doors- need to repave the walkway.
Review 7:
SHOULD have a sign to identify the property and the numbers displayed. Thank you.
Review 8:
My reservation was canceled without letting me know. Had to make last minute changes to my lodging for the nights stay at a different facility. It cost me a small fortune to find a place. I am not happy. I would never recommend anyone stay with this property owner
Review 9:
I barely slept. The pillows had a bad smell it was literally stinky. Too much noise, people walking around the property all night long it felt so unsafe
Review 10:
Over nice place….. remote did not work, parking could be difficult at times…
Review 11:
I would be happy to pay this much if I got what was in the photos. So, dissatisfying that when we arrived I felt duped with no recourse and stuck with what I got.
Generate a review with the following characteristics:
Rating: {rating}
`;
async function generateLlamaReview(
  rating: number,
  city: string,
): Promise<string> {
  const retryOptions = {
    retries: 3,
    timeout: 10000,
    delay: 1000,
  };
  for (let i = 0; i <= retryOptions.retries; i++) {
    try {
      const enrichedPrompt = prompt
        .replace("{rating}", rating.toString())
        .replace("{city}", city);
      const result = await model.generateContent(enrichedPrompt);
      const response = result.response;
      let review = response?.text() ?? "Default Review: Great place to stay";
      review = `${review}${generateHumanLikePhrases()}`;
      review = adjustReviewLength(review);
      review = `${review} ${generateEmojis()}`;
      return review;
    } catch (error) {
      console.error(
        `Error generating review from Gemini API (attempt ${i + 1}):`,
        error,
      );
      if (i === retryOptions.retries) {
        return "Default Review: Great place to stay";
      }
      await new Promise((resolve) => setTimeout(resolve, retryOptions.delay));
    }
  }
  return "Default Review: Great place to stay";
}
// =======================================================
// Main Review Generation Function
// =======================================================
async function generateFakeReviews() {
  try {
    console.time("db.query.properties.findMany");
    const propertiesWithoutReviews = await db.query.properties.findMany({
      where: (properties, { notExists }) =>
        notExists(
          db
            .select()
            .from(reviews)
            .where(eq(reviews.propertyId, properties.id)),
        ),
      columns: {
        id: true,
        city: true,
      },
    });
    console.timeEnd("db.query.properties.findMany");
    if (propertiesWithoutReviews.length === 0) {
      console.log("No properties found without reviews.");
      return;
    }
    console.log(
      `Found ${propertiesWithoutReviews.length} properties without reviews.`,
    );
    console.log("About to start fetching names and pics");
    const nameAndPic = await getAllNamesAndPics();
    console.log("Finished fetching names and pics");
    let reviewsGenerated = 0;
    for (const property of propertiesWithoutReviews) {
      // Added console log to output the current city.
      console.log(`Starting to generate reviews for city: ${property.city}`);
      console.log(`looping through property id: ${property.id}`);
      const numberOfReviews = Math.floor(Math.random() * 5) + 1;
      const reviewsToInsert = [];
      for (let i = 0; i < numberOfReviews; i++) {
        console.log(`generating review ${i} out of ${numberOfReviews}`);
        if (tokensUsed >= maxTokensToUse) {
          console.log(
            `Max tokens reached (${maxTokensToUse}). Stopping review generation.`,
          );
          break;
        }
        if (reviewsGenerated >= 100) {
          console.log("Generated 100 reviews, stopping");
          break;
        }
        const nameAndPicItem =
          nameAndPic[Math.floor(Math.random() * nameAndPic.length)];
        const rating = ratingRandomizer();
        let reviewText: string | null;
        let reviewSource: "AI" | "Template";
        const templateReview = await generateRandomReview(
          rating,
          property.city,
        );
        if (templateReview) {
          reviewText = templateReview;
          reviewSource = "Template";
        } else {
          const generatedReview = await generateLlamaReview(
            rating,
            property.city,
          );
          reviewText = generatedReview;
          reviewSource = "AI";
          tokensUsed += 300;
        }
        if (!reviewText) {
          console.error(
            `No review could be generated for property ${property.id}`,
          );
          continue;
        }
        const review = {
          name: nameAndPicItem?.name,
          profilePic: nameAndPicItem?.picture,
          rating: rating,
          review: reviewText,
          propertyId: property.id,
          date: generateRandomDate(),
          verified: generateRandomBoolean(0.8),
        };

        console.log(
          `Generated review for property ${property.id} (Source: ${reviewSource}):`,
          review,
        );
        reviewsToInsert.push(reviewsInsertSchema.parse(review));
        reviewsGenerated++;
      }
      try {
        if (reviewsToInsert.length > 0) {
          await db.insert(reviews).values(reviewsToInsert);
          console.log(`Generated reviews for property ID: ${property.id}`);
        }
      } catch (error) {
        console.error(
          `Error inserting reviews for property ID ${property.id}:`,
          error,
        );
      }
      if (reviewsGenerated >= 100) {
        console.log("Generated 100 reviews, stopping property loop");
        break;
      }
    }

    console.log("Finished generating fake reviews.");
  } catch (error) {
    console.error("Error generating fake reviews:", error);
  }
}
// =======================================================
// Run the Script
// =======================================================
await generateFakeReviews();
console.log(`Total tokens used: ${tokensUsed}`);
process.exit(0);
