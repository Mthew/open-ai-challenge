import Decimal from "decimal.js";
import { evaluate } from "mathjs";

export class Calculator {
  /**
   * Calculate the result of a formula using the provided values
   * @param formula The formula to evaluate
   * @param values A map of variable names to their values
   * @returns The calculated result rounded to 10 decimal places
   */
  calculate(formula: string, values: Map<string, number>): number {
    try {
      // Replace variable references with their values
      let processedFormula = formula;
      for (const [key, value] of values.entries()) {
        // Replace both dot notation and bracket notation
        const dotNotation = key.replace(".", "\\.");
        const regex = new RegExp(`${dotNotation}|\\[['"]${key}['"]\\]`, "g");
        processedFormula = processedFormula.replace(regex, value.toString());
      }

      // Use mathjs to safely evaluate the expression
      const result = evaluate(processedFormula);

      // Convert to Decimal for precise rounding
      const decimalResult = new Decimal(result.toString());

      // Round to 10 decimal places
      return decimalResult.toDecimalPlaces(10).toNumber();
    } catch (error) {
      console.error("Error calculating formula:", error);
      console.error("Formula:", formula);
      console.error("Values:", Object.fromEntries(values));
      throw new Error("Failed to calculate formula");
    }
  }
}
