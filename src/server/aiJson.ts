import { env } from "@/env";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(env.GEMINI_KEY);

const jsonModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: Infinity,
  },
});

export async function aiJson<T>({
  prompt,
  schema,
  retries = 3,
}: {
  prompt: string;
  schema: z.ZodType<T>;
  retries?: number;
}) {
  const jsonSchema = JSON.stringify(
    zodToJsonSchema(schema, { target: "openApi3" }),
    null,
    2,
  );

  const chat = jsonModel.startChat();

  let issues: string | undefined;
  let lastResponse: string | undefined;

  for (let i = 0; i < retries; i++) {
    const issuesPreamble = issues
      ? `There were the following issues with that response, please try again:\n\n${issues}\n\n---\n\n`
      : "";

    if (issuesPreamble) {
      console.log(lastResponse);
      console.log(issuesPreamble);
    }

    const res = await chat
      .sendMessage(
        `${issuesPreamble}Please respond with a JSON object that matches the following JSON schema exactly:\n\n${jsonSchema}\n\n---\n\n${prompt}`,
      )
      .then((r) => r.response.text())
      .then((r) => {
        lastResponse = r;
        return JSON.parse(r);
      })
      .then((r) => schema.safeParse(r));

    if (res.success) {
      console.log(`Succeeded after ${i + 1} retries`);
      return res.data;
    }

    issues = JSON.stringify(
      res.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
      null,
      2,
    );
  }

  throw new Error(`Failed after ${retries} retries`);
}
