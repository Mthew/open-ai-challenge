import axios from "axios";
import { config } from "../config/config";
import { Pokemon } from "../types";

export class PokeApiClient {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = config.pokeapi.baseUrl;
  }

  /**
   * Find a Pokémon by name
   * @param name The Pokémon name to search for
   * @returns The Pokémon data
   */
  async findPokemon(name: string): Promise<Pokemon> {
    try {
      // Convert name to lowercase as PokéAPI is case-sensitive
      const normalizedName = name.toLowerCase();
      const response = await axios.get(
        `${this.baseUrl}/pokemon/${normalizedName}`
      );
      return response.data;
    } catch (error) {
      //console.error(`Error finding Pokémon ${name}:`, error);
      throw new Error(`Failed to find Pokémon: ${name}`);
    }
  }
}
