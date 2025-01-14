import { env } from "@/env";
import LlamaAI from 'llamaai';

const apiToken = process.env.LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

interface LlamaResponse {
    choices: {
        message: {
            content: string;
            function_call?: {
                name: string;
                arguments: string;
            };
        };
    }[];
}

interface ContentModerationResult {
    isAppropriate: boolean;
    confidence: number;
    violationType?: "OFF_PLATFORM_BOOKING" | "CONTACT_INFO" | "INAPPROPRIATE" | "UNKNOWN";
    reason?: string;
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
        try {
            //debugging purposes
            console.log("Llama checking message")

            const apiRequestJson = {
                "model": "llama3.1-70b",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a content moderator."
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],

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
                "function_call": "content_moderation",
            };

            const response = await llamaAPI.run(apiRequestJson);
            const data = response.data as LlamaResponse;

            // Add null checks and provide fallback
            if (!data.choices?.length) {
                throw new Error("Invalid response from LLaMA API");
            }

            const result = JSON.parse(
                data.choices[0]?.message?.function_call?.arguments ?? "{}"
            );

            console.log("Llama result:", result);

            return result as ContentModerationResult;
        } catch (error) {
            console.error("LLaMA API Error:", error);
            throw new Error("Failed to moderate content");
        }
    }
}

export const llamaClient = new LlamaClient();