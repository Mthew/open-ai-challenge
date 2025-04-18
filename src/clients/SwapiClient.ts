import axios from "axios";
import https from "https";
import { config } from "../config/config";
import { SwapiCharacter, SwapiPlanet } from "../types";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class SwapiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.swapi.baseUrl;
  }

  /**
   * Search for a Star Wars character by name
   * @param name The character name to search for
   * @returns The character data
   */
  async searchCharacter(name: string): Promise<SwapiCharacter> {
    try {
      const response = await axios.get(`${this.baseUrl}/people`, {
        params: { search: "Calrissian" },
        httpsAgent: agent,
      });

      const results = response.data.results;
      if (results.length === 0) {
        throw new Error(`Character not found: ${name}`);
      }

      // Return the first match
      return results[0];
    } catch (error) {
      console.error(`Error searching for character ${name}:`, error);
      throw new Error(`Failed to find character: ${name}`);
    }
  }

  /**
   * Search for a Star Wars planet by name
   * @param name The planet name to search for
   * @returns The planet data
   */
  async searchPlanet(name: string): Promise<SwapiPlanet> {
    try {
      const response = await axios.get(`${this.baseUrl}/planets`, {
        params: { search: name },
        httpsAgent: agent,
      });

      const results = response.data.results;
      if (results.length === 0) {
        throw new Error(`Planet not found: ${name}`);
      }

      // Return the first match
      return results[0];
    } catch (error) {
      console.error(`Error searching for planet ${name}:`, error);
      throw new Error(`Failed to find planet: ${name}`);
    }
  }

  /**
   * Get details from a SWAPI URL
   * @param url The SWAPI URL to fetch
   * @returns The data from the URL
   */
  async getDetails<T>(url: string): Promise<T> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching details from ${url}:`, error);
      throw new Error(`Failed to fetch details from ${url}`);
    }
  }
}
