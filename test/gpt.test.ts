import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "https://recruiting.adere.so/chat_completion";
const TOKEN = process.env.OPEN_AI || "";

interface TestCase {
  name: string;
  prompt: string;
  expected: {
    entities_attributes: Record<string, string[]>;
    formula: string;
  };
}

const testCases: TestCase[] = [
  {
    name: "Obi-Wan & Snorlax",
    prompt: `Obi-Wan Kenobi llega a Alderaan, un planeta conocido por su gran población. Mientras analiza su entorno, se pregunta cuántas veces el diámetro del planeta puede dividirse entre el peso de su compañero Pokémon, Snorlax.`,
    expected: {
      entities_attributes: {
        Alderaan: ["diameter"],
        Snorlax: ["weight"],
      },
      formula: "Alderaan.diameter / Snorlax.weight",
    },
  },
  {
    name: "Leia + Pikachu",
    prompt: `La Princesa Leia, originaria de Alderaan, decide usar a Pikachu en su entrenamiento. Si la experiencia base de Pikachu se suma al periodo de rotación de Alderaan, ¿cuál será el total de energía que podrá acumular?`,
    expected: {
      entities_attributes: {
        Alderaan: ["rotation_period"],
        Pikachu: ["base_experience"],
      },
      formula: "Alderaan.rotation_period + Pikachu.base_experience",
    },
  },
  {
    name: "Vader * Charmander",
    prompt: `Darth Vader entrena con Charmander en el planeta Mustafar. Quiere saber cuánto poder tiene su compañero si se multiplica la altura de Darth por el peso del Pokémon.`,
    expected: {
      entities_attributes: {
        "Darth Vader": ["height"],
        Charmander: ["weight"],
      },
      formula: "Darth Vader.height * Charmander.weight",
    },
  },
  {
    name: "Yoda + Squirtle + Tatooine",
    prompt: `Mientras viaja a Tatooine, Yoda decide entrenar a Squirtle. Si la experiencia base de Squirtle se multiplica por el período orbital del planeta y luego se divide por la masa de Yoda, ¿cuál será el resultado?`,
    expected: {
      entities_attributes: {
        Tatooine: ["orbital_period"],
        Squirtle: ["base_experience"],
        Yoda: ["mass"],
      },
      formula:
        "(Squirtle.base_experience * Tatooine.orbital_period) / Yoda.mass",
    },
  },
];

const systemPrompt = `Eres un experto en analizar enunciados que involucran personajes, planetas de Star Wars y Pokémon. Tu tarea es estructurar el enunciado en dos partes:

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
`;

async function runTestCases() {
  const promises = testCases.map((testCase) => {
    return axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "developer", content: systemPrompt },
          { role: "user", content: testCase.prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
  });

  const reponses = await Promise.all(promises);

  for (const response of reponses) {
    const i = reponses.indexOf(response);
    const testCase = testCases[i];
    try {
      const aiResponse = JSON.parse(
        response.data.choices[0].message.content.trim()
      );

      const passed =
        JSON.stringify(aiResponse.entities_attributes) ===
          JSON.stringify(testCase.expected.entities_attributes) &&
        aiResponse.formula === testCase.expected.formula;

      console.log(`✅ ${testCase.name}: ${passed ? "PASSED" : "FAILED"}`);
      if (!passed) {
        console.log("Expected:", testCase.expected);
        console.log("Received:", aiResponse);
      }
    } catch (err: any) {
      console.error(
        `❌ Error en ${testCase.name}:`,
        err.response?.data || err.message
      );
    }
  }
}

runTestCases();
