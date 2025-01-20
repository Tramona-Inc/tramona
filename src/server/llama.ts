import { env } from "@/env";
import LlamaAI from 'llamaai';

const apiToken = process.env.LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

interface LlamaResponse {
    message: {
        content: string;
        function_call?: {
            name: string;
            arguments: string;
        };
    };
}[];

interface ContentModerationResult {
    isAppropriate: boolean;
    confidence: number;
    violationType?: "OFF_PLATFORM_BOOKING" | "CONTACT_INFO" | "INAPPROPRIATE" | "NONE";
    reason?: string;
}


// parses content from llama into ContentModerationResult object
function parseContentModerationResult(input: string): ContentModerationResult {
    try {
        // Define regular expressions for each key
        const isAppropriateRegex = /"isAppropriate":\s*(true|false)/i;
        const confidenceRegex = /"confidence":\s*([0-9.]+)/i;
        const violationTypeRegex = /"violationType":\s*("([^"]*)"|([A-Z_]+))/i;
        const reasonRegex = /"reason":\s*"(.*?)"/i;

        // Extract values using the regular expressions
        const isAppropriateMatch = input.match(isAppropriateRegex);
        const confidenceMatch = input.match(confidenceRegex);
        const violationTypeMatch = input.match(violationTypeRegex);
        const reasonMatch = input.match(reasonRegex);

        // Parse extracted values
        const isAppropriateVal = isAppropriateMatch ? isAppropriateMatch[1] === 'true' : null;
        const confidenceVal = confidenceMatch && confidenceMatch[1] !== undefined ? parseFloat(confidenceMatch[1]) : null;
        const violationTypeVal = violationTypeMatch && violationTypeMatch[1] !== undefined ? violationTypeMatch[1].replace(/"/g, '') : null;
        const reasonVal = reasonMatch ? reasonMatch[1] : null;

        // Ensure required fields are present
        if (isAppropriateVal === null || confidenceVal === null) {
            throw new Error("Missing required fields in the input string.");
        }

        // Return the result as an object
        return {
            isAppropriate: isAppropriateVal,
            confidence: confidenceVal,
            violationType: violationTypeVal,
            reason: reasonVal,
        } as ContentModerationResult;

    } catch (error) {
        console.error("Error parsing moderation result string:", error, "input:", input);
        return {
            isAppropriate: true,
            confidence: 0.5,
            violationType: "NONE",
            reason: "Failed to parse Llama response"
        } as ContentModerationResult;
    }
}


export class LlamaClient {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.LLAMA_API_KEY || ""; // Provide a fallback value
        if (!this.apiKey) {
            throw new Error("LLAMA_API_KEY is not defined in the environment variables");
        }
    }

    async moderateContent(message: string): Promise<ContentModerationResult> {

        const timeout = 5000; // 5 seconds
        const timeoutPromise = new Promise<ContentModerationResult>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Llama API request timed out"));
            }, timeout);
        });

        try {
            //debugging purposes
            console.log("Llama checking message, llama.ts")

            const apiRequestJson = {
                "model": "llama3.1-70b",
                "functions": [
                    {
                        "name": "content_moderation",
                        "description": "Analyze message content for policy violations and return in the format: {\"isAppropriate\": <boolean>, \"confidence\": <number>, \"violationType\": <string>, \"reason\": <string>}",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "isAppropriate": {
                                    "type": "boolean",
                                    "description": "Whether the message complies with platform policies"
                                },
                                "confidence": {
                                    "type": "number",
                                    "description": "Confidence score between 0 and 1"
                                },
                                "violationType": {
                                    "type": "string",
                                    "description": "Type of violation detected: off-platform booking, contact information, inappropriate content, or none if the message complies with platform policies",
                                    "enum": ["OFF_PLATFORM_BOOKING", "CONTACT_INFO", "INAPPROPRIATE", "NONE"]
                                },
                                "reason": {
                                    "type": "string",
                                    "description": "Explanation of the violation"
                                }
                            },
                            "required": [
                                "isAppropriate",
                                "confidence",
                                "violationType",
                                "reason"
                            ]
                        }
                    }
                ],
                "function_call": { "name": "content_moderation" },
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a strict content moderation AI. You must: 1) ALWAYS respond by calling the function ‘content_moderation’ with a valid JSON object containing: { isAppropriate, confidence, violationType, reason }. 2) NEVER provide any plain text. 3) If the user message is safe, set isAppropriate=true, violationType=“NONE”, etc. 4) If there’s an issue, fill in the correct fields accordingly. violationType should be equal to one of these: ['OFF_PLATFORM_BOOKING', 'CONTACT_INFO', 'INAPPROPRIATE', 'NONE']"
                    },
                    {
                        "role": "user",
                        "content": "message: " + message
                    }
                ],
            };

            const response = await Promise.race([
                llamaAPI.run(apiRequestJson),
                timeoutPromise
            ]);

            // debugging purposes
            // should be something like this:
            // {
            //     "role": "system",
            //     "content": null,
            //     "function_call": {
            //       "name": "content_moderation",
            //       "arguments": {
            //         "isAppropriate": false,
            //         "confidence": 0.85,
            //         "violationType": "OFF_PLATFORM_BOOKING",
            //         "reason": "Shared email and number and attempted off-platform booking."
            //       }
            //     }
            //   }
            console.log("llama.ts: Llama response: ", response['choices'][0]['message'].content);

            const data = response['choices'][0]['message'] as LlamaResponse["message"];

            // Add null checks and return a 
            if (!data?.content) {
                console.error("LLaMA API Returned null");
                return {
                    "isAppropriate": true,
                    "confidence": 0.85,
                    "violationType": "NONE",
                    "reason": "Llama API failed to return"
                } as ContentModerationResult;
            }

            let result = parseContentModerationResult(data.content);

            // debugging purposes
            // should be something like this:
            // {
            //    "isAppropriate": false,
            //    "confidence": 0.85,
            //    "violationType": "OFF_PLATFORM_BOOKING",
            //    "reason": "Shared email and number and attempted off-platform booking."
            // }
            console.log("llama.ts: Llama result: ", result);

            return result as ContentModerationResult;

        } catch (error) {
            console.error("LLaMA API Error:", error);
            return {
                "isAppropriate": true,
                "confidence": 0.85,
                "violationType": "NONE",
                "reason": "Llama API failed to return"
            } as ContentModerationResult;
        }
    }
}

export const llamaClient = new LlamaClient();