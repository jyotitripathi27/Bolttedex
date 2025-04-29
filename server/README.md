# Pokemon server API

This is a backend application for retrieving Pokemon data. It provides an API to fetch information about various Pokemon, leveraging caching for performance.

API Endpoints

GET /api/pokemons
Fetches a list of Pokemon.

Response:

200 - Returns an array of Pokemon objects.
404 - No record found.
500 - Internal Server Error.


## Features

- Fetch Pokemon data from a third-party API. (pokeapi.co)
- Cache responses to reduce API calls and improve performance.
- Comprehensive testing with Jest, including code coverage reports.

## Technologies Used

- Node.js
- Express
- Jest for testing
- Redis for caching (mocked in tests)

## Getting Started

### Prerequisites

- Node.js
- npm (Node package manager)
- redis
    for windows follow this guide - https://redis.io/docs/latest/operate/oss_and_stack/install/install-stack/docker/

    OR 
    Start a local Redis server using Docker:

    docker run --name redis-local -p 6379:6379 -d redis

### Installation

1. Clone the repository:

   git clone https://github.com/yourusername/pokemon-api-backend.git
   cd pokemon-api-backend
   
2. Install the dependencies:
    
   npm install

3. Running the Application:

   npm start - for localhost
      - The server will run on http://localhost:5000 (or your specified port).

   npm run start-dev - for development 
   npm run start-prod - for production (make sure to include .env.prod file)

4. Running Tests

    npm test

5. Code Coverage - To generate a code coverage report along with tests, run:

    npm run test:coverage

    After running the command, you can find the coverage report in the coverage directory. Open index.html in your browser to view the detailed report.


# There are few other commands for development support -

### `npm run cleanup-redis`
This is to cleanup all records from redis cache - helping in testing
To support this, I have created a script in the root folder - /redisCleanup.js

### `npm run clean-start`

This is to start the server immediately after cleaning up the redis cache