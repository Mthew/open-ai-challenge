export type ExcutionMode = "test" | "prod";

// OpenAI API Types
export interface Problem {
  id: string;
  problem: string;
}

export interface SubmitResponse {
  message: string;
  correct: number;
  incorrect: number;
  next_problem: Problem;
}

export interface AiResponse {
  entities_attributes: {
    [entity: string]: string[];
  };
  formula: string;
}

// SWAPI Types
export interface SwapiCharacter {
  name: string;
  mass: string;
  height: string;
  birth_year: string;
  eye_color: string;
  hair_color: string;
  skin_color: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface SwapiPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

// PokéAPI Types
export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      version_group: {
        name: string;
        url: string;
      };
      move_learn_method: {
        name: string;
        url: string;
      };
    }[];
  }[];
  sprites: {
    front_default: string;
    [key: string]: string | null;
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}
