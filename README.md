# NBA Players REST API

## Project Description
A RESTful API built using Node.js and Express to manage a collection of NBA players. Player information is stored in a local JavaScript array rather than a database.

## Setup
Install dependencies using `npm install` and start the server using `npm start`.

The API runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/resources | Retrieve all players |
| GET | /api/resources/:id | Retrieve a player by ID |
| POST | /api/resources | Add a new player |
| PUT | /api/resources/:id | Update an existing player |
| DELETE | /api/resources/:id | Remove a player |

## Testing Evidence

All five endpoints were successfully tested locally using curl in the VS Code terminal. The following commands provide a reproducible test sequence using Evan Mobley.

### GET All Players
`curl -i http://localhost:3000/api/resources`

**Result:** 200 OK. Returned the player collection as JSON.

### GET Player by ID
`curl -i http://localhost:3000/api/resources/2`

**Result:** 200 OK. Retrieved the player with ID 2.

### GET Nonexistent Player
`curl -i http://localhost:3000/api/resources/999`

**Result:** 404 Not Found. Returned `{"error":"Player not found"}`.

### POST New Player
`curl -i -X POST http://localhost:3000/api/resources -H "Content-Type: application/json" -d '{"name":"Evan Mobley","team":"Cavs"}'`

**Expected result:** 201 Created. Adds Evan Mobley with the automatically generated ID 4.

### PUT Update Player
`curl -i -X PUT http://localhost:3000/api/resources/4 -H "Content-Type: application/json" -d '{"team":"Cavaliers"}'`

**Expected result:** 200 OK. Updates Evan Mobley's team field to Cavaliers.

### DELETE Player
`curl -i -X DELETE http://localhost:3000/api/resources/4`

**Expected result:** 200 OK. Removes the player with ID 4.

### Verify Deletion
`curl -i http://localhost:3000/api/resources/4`

**Expected result:** 404 Not Found. Confirms the deleted player no longer exists.

## Middleware
The application uses `express.json()` to parse incoming JSON requests.

A custom logging middleware prints the timestamp, HTTP method, and requested endpoint to the server terminal.

## Data Storage
Player information is stored in memory using a JavaScript array. Data resets to its initial state when the server restarts.