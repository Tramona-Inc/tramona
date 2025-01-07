import { env } from "@/env";

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
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.LLAMA_API_KEY || ""; // Provide a fallback value
        if (!this.apiKey) {
            throw new Error("LLAMA_API_KEY is not defined in the environment variables");
        }
        this.baseUrl = "https://api.llama-api.com";
    }

    async moderateContent(message: string): Promise<ContentModerationResult> {
        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: "llama3.1-70b",
                    messages: [
                        {
                            role: "system",
                            content: "You are a content moderator checking for off-platform booking attempts and inappropriate content.",
                        },
                        { role: "user", content: message },
                    ],
                    functions: [
                        {
                            name: "content_moderation",
                            description: "Analyze message content for policy violations",
                            parameters: {
                                type: "object",
                                properties: {
                                    isAppropriate: {
                                        type: "boolean",
                                        description: "Whether the message complies with platform policies",
                                    },
                                    confidence: {
                                        type: "number",
                                        description: "Confidence score between 0 and 1",
                                    },
                                    violationType: {
                                        type: "string",
                                        enum: ["OFF_PLATFORM_BOOKING", "CONTACT_INFO", "INAPPROPRIATE", "NONE"],
                                    },
                                    reason: {
                                        type: "string",
                                        description: "Explanation of the violation",
                                    },
                                },
                                required: ["isAppropriate", "confidence"],
                            },
                        },
                    ],
                    function_call: { name: "content_moderation" },
                }),
            });

            const data = (await response.json()) as LlamaResponse;

            // Add null checks and provide fallback
            if (!data.choices?.length) {
                throw new Error("Invalid response from LLaMA API");
            }

            const result = JSON.parse(
                data.choices[0]?.message?.function_call?.arguments ?? "{}"
            );

            return result as ContentModerationResult;
        } catch (error) {
            console.error("LLaMA API Error:", error);
            throw new Error("Failed to moderate content");
        }
    }
}

export const llamaClient = new LlamaClient();