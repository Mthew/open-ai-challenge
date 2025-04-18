import axios from "axios";
import { config } from "../config/config";
import { AiResponse } from "../types";

export class AiProxyClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    this.baseUrl = config.openAI.apiUrl;
    this.token = config.openAI.token;
  }

  /**
   * Get interpretation of a problem from the AI proxy
   * @param problemText The problem text to interpret
   * @returns The AI interpretation with entities and formula
   */
  async getInterpretation(problemText: string): Promise<AiResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat_completion`,
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "developer", content: config.systemPrompt },
            { role: "user", content: problemText },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      // Parse the AI response to extract the JSON
      // Extract and validate the response structure
      if (!response.data.choices?.[0]?.message?.content) {
        throw new Error("Invalid API response structure");
      }

      // Parse the content from the message
      const aiResponse = JSON.parse(
        response.data.choices[0].message.content.trim()
      );

      // Validate the response format
      if (!aiResponse.entities_attributes || !aiResponse.formula) {
        throw new Error("Invalid AI response format");
      }

      return aiResponse;
    } catch (error) {
      console.error("Error getting AI interpretation:", error);
      throw new Error("Failed to get AI interpretation");
    }
  }
}
