import { OpenAIClient } from "./clients/OpenAIClient";
import { AiProxyClient } from "./clients/AiProxyClient";
import { CacheService } from "./services/CacheService";
import { DataFetcher } from "./services/DataFetcher";
import { Calculator } from "./services/Calculator";
import { Problem } from "./types";

async function main() {
  console.log("Starting OpenAI Problem Solver...");

  // Initialize clients and services
  const openAIClient = new OpenAIClient();
  const aiProxyClient = new AiProxyClient();
  const cacheService = new CacheService();
  const dataFetcher = new DataFetcher(cacheService);
  const calculator = new Calculator();

  // Record start time
  const startTime = Date.now();
  //const timeLimit = 3 * 60 * 1000; // 3 minutes in milliseconds
  const timeLimit = 10 * 1000; // 2 seconds

  try {
    // Start the challenge
    let problem = await openAIClient.startTest();
    console.log(`Received problem: ${problem.problem}`);

    // Main problem-solving loop
    //while (problem && Date.now() - startTime < timeLimit) {
    try {
      console.log(`Solving problem ${problem.id}...`, problem);

      // Get AI interpretation
      const interpretation = await aiProxyClient.getInterpretation(
        problem.problem
      );
      console.log("AI Interpretation:", interpretation);

      // Fetch required data
      const attributeValues = await dataFetcher.fetchAttributes(
        interpretation.entities_attributes
      );
      console.log("Attribute values:", Object.fromEntries(attributeValues));
      // Calculate the answer
      const answer = calculator.calculate(
        interpretation.formula,
        attributeValues
      );
      console.log(`Calculated answer: ${answer}`);

      // Submit the solution
      //problem = await OpenAIClient.submitSolution(problem.id, answer);
      //@ts-ignore
      console.log("PROBLEM SOLVED =====>", problem.solution, answer);

      /*
       
      problem = await OpenAIClient.startTest();

      console.log(
        `Solution submitted. ${
          problem
            ? "Next problem received."
            : `Challenge completed with ${problem}.`
        }`
      );
      */
    } catch (error) {
      console.error("Error solving problem:", error);

      // If we have a problem ID, submit a default answer to continue
      if (problem && problem.id) {
        try {
          console.log("Submitting default answer (0) to continue...");
          //problem = await OpenAIClient.submitSolution(problem.id, 0);
          console.log(
            `Default answer submitted. ${
              problem ? "Next problem received." : "Challenge completed."
            }`
          );
        } catch (submitError) {
          console.error("Error submitting default answer:", submitError);
          //break;
        }
      } else {
        //break;
      }
    }
    //}

    // Check if we ran out of time
    if (Date.now() - startTime >= timeLimit) {
      console.log("Time limit reached. Challenge ended.");
    }
  } catch (error) {
    console.error("Fatal error:", error);
  }

  console.log("OpenAI Problem Solver finished.");
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
