# OPEN_AI Problem Solver

An automated solution for the OpenAI programming challenge that solves mathematical problems based on Star Wars and Pokémon data through natural language processing.

## Features

- Natural language problem interpretation using AI
- Integration with SWAPI and PokéAPI
- Precise mathematical calculations with decimal.js
- Efficient caching system
- Type-safe implementation with TypeScript

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API token

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd OpenAI-problem-solver
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your OpenAI API token:

```
OPEN_AI_TOKEN=your_token_here
```

## Usage

### Production Mode

1. Build the project:

```bash
npm run build
```

2. Run the solution:

```bash
npm start
```

### Development Mode

#### Using npm directly:

```bash
npm run dev
```

#### Using the development scripts:

- On Windows:

```bash
dev.bat
```

- On Linux/Mac:

```bash
./dev.sh
```

The development mode uses `nodemon` to automatically restart the application when files change.

## Project Structure

```
src/
├── config/          # Configuration and environment variables
├── clients/         # API clients for external services
├── services/        # Core business logic
├── types/          # TypeScript interfaces
└── main.ts         # Application entry point
```

## API Integration

The solution integrates with three main APIs:

- OpenAI API: Problem fetching and solution submission
- SWAPI: Star Wars character and planet data
- PokéAPI: Pokémon data

## Performance

- In-memory caching for API responses
- Parallel API requests where possible
- Efficient formula evaluation
- Graceful error handling

## Error Handling

The solution includes comprehensive error handling for:

- API failures
- Data parsing errors
- Calculation errors
- Timeout management

## License

MIT
