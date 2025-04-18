import { SwapiClient } from "../clients/SwapiClient";
import { PokeApiClient } from "../clients/PokeApiClient";
import { CacheService } from "./CacheService";
import { SwapiCharacter, SwapiPlanet, Pokemon } from "../types";

export class DataFetcher {
  private swapiClient: SwapiClient;
  private pokeApiClient: PokeApiClient;
  private cache: CacheService;

  constructor(cache: CacheService) {
    this.swapiClient = new SwapiClient();
    this.pokeApiClient = new PokeApiClient();
    this.cache = cache;
  }

  /**
   * Fetch attributes for entities from the AI interpretation
   * @param entities The entities and their attributes to fetch
   * @returns A map of attribute values
   */
  async fetchAttributes(
    entities: Record<string, string[]>
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    const fetchPromises: Promise<void>[] = [];

    for (const [entity, attributes] of Object.entries(entities)) {
      console.log(
        `Start the search with ${entity} character with attributes ${attributes}`
      );
      for (const attribute of attributes) {
        console.log(`destructuring of atributte ${attribute} character`);

        const cacheKey = `${entity}.${attribute}`;
        // Check cache first
        const cachedValue = this.cache.get<number>(cacheKey);
        if (cachedValue !== undefined) {
          result.set(cacheKey, cachedValue);
          continue;
        }

        // Determine entity type and fetch data

        const fetchPromise = this.fetchEntityAttribute(entity, attribute)
          .then((value) => {
            result.set(cacheKey, value);
            this.cache.set(cacheKey, value);
          })
          .catch((error) => {
            console.error(`Error fetching ${cacheKey}:`, error);
            // Use a default value of 0 for failed fetches
            result.set(cacheKey, 0);
          });

        fetchPromises.push(fetchPromise);
      }
    }

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);
    return result;
  }

  /**
   * Fetch a specific attribute for an entity
   * @param entity The entity name
   * @param attribute The attribute to fetch
   * @returns The attribute value as a number
   */
  private async fetchEntityAttribute(
    entity: string,
    attribute: string
  ): Promise<number> {
    // Try to determine if it's a Star Wars character
    try {
      const character = await this.swapiClient.searchCharacter(entity);
      if (this.hasAttribute(character, attribute)) {
        return this.extractNumericValue(character, attribute);
      }
    } catch (error) {
      // Not a character, continue to next check
    }

    // Try to determine if it's a Star Wars planet
    try {
      const planet = await this.swapiClient.searchPlanet(entity);
      if (this.hasAttribute(planet, attribute)) {
        return this.extractNumericValue(planet, attribute);
      }
    } catch (error) {
      // Not a planet, continue to next check
    }

    // Try to determine if it's a Pokémon
    try {
      const pokemon = await this.pokeApiClient.findPokemon(entity);
      if (this.hasAttribute(pokemon, attribute)) {
        return this.extractNumericValue(pokemon, attribute);
      }
    } catch (error) {
      // Not a Pokémon
    }

    throw new Error(
      `Could not find attribute ${attribute} for entity ${entity}`
    );
  }

  /**
   * Check if an object has a specific attribute
   * @param obj The object to check
   * @param attribute The attribute to check for
   * @returns True if the attribute exists
   */
  private hasAttribute(obj: any, attribute: string): boolean {
    return attribute in obj;
  }

  /**
   * Extract a numeric value from an object attribute
   * @param obj The object containing the attribute
   * @param attribute The attribute to extract
   * @returns The numeric value
   */
  private extractNumericValue(obj: any, attribute: string): number {
    const value = obj[attribute];

    // Handle string values that should be numbers
    if (typeof value === "string") {
      // Remove commas from numbers like "1,000"
      const cleanValue = value.replace(/,/g, "");
      const numValue = parseFloat(cleanValue);

      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    // Handle direct number values
    if (typeof value === "number") {
      return value;
    }

    throw new Error(`Attribute ${attribute} is not a numeric value`);
  }
}
