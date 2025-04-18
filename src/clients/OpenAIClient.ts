import axios from "axios";
import { config } from "../config/config";
import { ExcutionMode, Problem, SubmitResponse } from "../types";

export class OpenAIClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly executionMode: ExcutionMode;

  constructor() {
    this.baseUrl = config.openAI.apiUrl;
    this.token = config.openAI.token;
    this.executionMode = config.openAI.executionMode as ExcutionMode;
  }

  /**
   * Start the challenge and get the first problem
   */
  async startTest(): Promise<Problem> {
    try {
      let apiUrl =
        this.executionMode === "prod"
          ? `${this.baseUrl}/challenge/start`
          : `${this.baseUrl}/challenge/test`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error starting test:", error);
      throw new Error("Failed to start the challenge");
    }
  }

  /**
   * Submit a solution for a problem
   * @param problemId The ID of the problem
   * @param answer The calculated answer
   * @returns The next problem or completion status
   */
  async submitSolution(
    problemId: string,
    answer: number
  ): Promise<SubmitResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/challenge/solution`,
        {
          problem_id: problemId,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting solution:", error);
      throw new Error("Failed to submit solution");
    }
  }
}
