# NBA Players REST API

## Project Description
A RESTful API built using Node.js, Express, and PostgreSQL to manage NBA players. This project extends my previous Express API by replacing its JavaScript array with a persistent PostgreSQL database.

## Technologies
- Node.js
- Express
- PostgreSQL
- pg (Node.js PostgreSQL driver)
- Thunder Client for API testing

## Database Setup

1. Install PostgreSQL and start the database server.
2. Create a database named `nba_api`.
3. Run `schema.sql` to create the `players` table.
4. Install Node.js dependencies using `npm install`.
5. Start the application using `node server.js`.

On my Mac, I used these commands to configure PostgreSQL:

```bash
brew services start postgresql@18
/opt/homebrew/opt/postgresql@18/bin/createdb nba_api
/opt/homebrew/opt/postgresql@18/bin/psql -d nba_api -f schema.sql
```

The database connection is configured in `db.js` for a local PostgreSQL server on port 5432. Other environments may require different connection settings.

The API runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/items | Retrieve all players |
| GET | /api/items/:id | Retrieve a player by ID |
| POST | /api/items | Add a new player |
| PUT | /api/items/:id | Update an existing player |
| DELETE | /api/items/:id | Permanently remove a player |

## Testing Evidence

All five endpoints were successfully tested locally using Thunder Client in VS Code.

### GET All Players
**Request:** `GET /api/items`

**Result:** 200 OK. Returned the saved players from PostgreSQL as JSON.

### GET Player by ID
**Request:** `GET /api/items/1`

**Result:** 200 OK. Retrieved Victor Wembanyama using his database ID.

### GET Nonexistent Player
**Request:** `GET /api/items/999`

**Result:** 404 Not Found. Returned `{"error":"Player not found"}`.

### POST New Player
**Request:** `POST /api/items`

**JSON Body:**
```json
{
  "name": "Victor Wembanyama",
  "team": "Spurs"
}
```

**Result:** 201 Created. Inserted the player into PostgreSQL and returned the saved record with ID 1.

### PUT Update Player
**Request:** `PUT /api/items/1`

**JSON Body:**
```json
{
  "team": "San Antonio Spurs"
}
```

**Result:** 200 OK. Updated the team while preserving the player's ID and name. A subsequent GET confirmed the change.

### DELETE Player
**Request:** `DELETE /api/items/2`

**Result:** 200 OK. Removed the temporary Test Player from PostgreSQL.

### Verify Deletion
**Request:** `GET /api/items/2`

**Result:** 404 Not Found. Confirmed the deleted player could no longer be retrieved.

### Persistence Test
Restarted the Express server and requested `GET /api/items/1` again. The response returned Victor Wembanyama with the updated team, confirming that PostgreSQL retained the data after the server restarted.

## Middleware
The application uses `express.json()` to parse incoming JSON requests.

Custom logging middleware prints the timestamp, HTTP method, and requested endpoint to the server terminal.

## Data Storage
NBA players are stored in a PostgreSQL table named `players`, containing `id`, `name`, and `team` columns.

PostgreSQL generates unique player IDs automatically. API routes execute SQL queries to retrieve, insert, update, and delete records. Player data persists after restarting the Express application.