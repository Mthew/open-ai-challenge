import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["OPEN_AI_TOKEN"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  openAI: {
    token: process.env.OPEN_AI_TOKEN!,
    apiUrl: process.env.OPEN_AI_API_URL || "https://api.openAI.com",
    executionMode: process.env.EXECUTION_MODE || "test",
  },
  swapi: {
    baseUrl: process.env.SWAPI_BASE_URL || "https://swapi.dev/api",
  },
  pokeapi: {
    baseUrl: process.env.POKEAPI_BASE_URL || "https://pokeapi.co/api/v2",
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || "180000", 10), // 3 minutes default
  },
  systemPrompt: `Eres un experto en analizar enunciados que involucran personajes, planetas de Star Wars y Pokémon. Tu tarea es estructurar el enunciado en dos partes:

1. Extrae las entidades mencionadas y sus atributos relevantes, listándolos en un objeto JSON llamado 'entities_attributes'. Cada clave debe ser el nombre exacto de la entidad y el valor una lista con los atributos necesarios, usando exclusivamente los siguientes nombres:
- name, rotation_period, orbital_period, diameter, surface_water, population  
- height, mass, homeworld  
- base_experience, weight

2. Construye una fórmula matemática que represente el cálculo que se debe realizar, utilizando el formato Entidad.atributo.

Responde solo en formato JSON como el siguiente:
{
  "entities_attributes": {
    "Luke Skywalker": ["mass"],
    "Vulpix": ["base_experience"]
  },
  "formula": "Luke Skywalker.mass * Vulpix.base_experience"
}
`,
} as const;
