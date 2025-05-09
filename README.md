# Steps to run web this application :

1) Clone the repo using below command -
git clone https://github.com/jyotitripathi27/Bolttedex.git

2) To run server application, run below command from the root folder -
cd server && npm start

3) To run the frontend app, run below command from the root folder -
cd client && npm start

4) This will open the application on http://localhost:3000 on browser.

5) That's it!

----


# More details on server and client apps -

# Pokemon server API (Server Application)

This is a backend application for retrieving Pokemon data. It provides an API to fetch information about various Pokemon, leveraging caching for performance.

API Endpoints

GET /api/pokemons?limit=30&offset=0
- Fetches a list of Pokemon.

Response:

- 200 - Returns an array of Pokemon objects.
- 404 - No record found.
- 500 - Internal Server Error.


## Features

- Fetch Pokemon data from a third-party API. (pokeapi.co)
- Cache responses to reduce API calls and improve performance.
   - TTL for each cache record is set to 1 day and can be changed using .env.local file
- Comprehensive testing with Jest, including code coverage reports.

## Technologies Used

- Node.js
- Express
- Jest for testing
- Redis for caching

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

   - git clone git clone https://github.com/jyotitripathi27/Bolttedex.git
   - cd server
   
2. Install the dependencies:
    
   - npm install

3. Running the Application:

   - npm start - for localhost
      - The server will run on http://localhost:5000 (or your specified port).

   - npm run start-dev - for development 
   - npm run start-prod - for production (make sure to include .env.prod file)

4. Running Tests

   - npm test

5. Code Coverage - To generate a code coverage report along with tests, run:

   - npm run test:coverage

   After running the command, you can find the coverage report in the coverage directory. Open index.html in your browser to view the detailed report.


# There are few other commands for development support -

### `npm run cleanup-redis`
- This is to cleanup all records from redis cache - helping in testing
   - To support this, I have created a script in the /server root folder - /redisCleanup.js

### `npm run clean-start`
- This is to start the server immediately after cleaning up the redis cache


----


# Pokemon frontend Application (Client Application)

This is a frontend application for Bolttedex. It shows a list of Pokemon and you can see the pokemon details in a popup card on click of a pokemon from the list.

![image](https://github.com/user-attachments/assets/7d86eee2-e583-402f-af0e-a9bb95efc561)

![image](https://github.com/user-attachments/assets/b024889e-a5f4-4285-a6f4-a63d246057f9)



# App URL

http://localhost:3000


## Available Scripts

In the project directory, you can run:

### `npm i && npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
Note - you might see deprecation warnings related to webpack-dev-server, The warnings are caused by react-scripts using an older webpack-dev-server version. They are harmless and do not affect app functionality.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


### `npm run test:coverage`

This will run test cases along with code coverage report.



---- 

### Techniques and Business logic explanation -

# Frontend Application:

- I chose React Query for server-state management.
- Also, I used virtualization for Pokemon listing. Virtualization keeps the app fast and memory-efficient, and it's very lightweight.


# Server Application:

- To correctly calculate Pokemon weaknesses, I gathered information using the Pokemon Type API (https://pokeapi.co/api/v2/type/${type}). 
- I checked each weakness against the resistances (both double_damage_to and half_damage_from), immunities (no_damage_from), and half damage (half_damage_from) before finalizing the weaknesses.
- Removed any weakness that appears in any of the resistance or immunity sets.

- To get Region for each Pokémon, Instead of rough guessing by Pokemon ID range, I am doing these steps:
   - Call (https://pokeapi.co/api/v2/pokemon-species/${id})
   - Get the pokedex_numbers
   - Skip "national"
   - Map to region


