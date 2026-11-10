const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 3000;

// Log incoming requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${req.method} ${req.originalUrl}`);
    next();
});

// Parse incoming JSON data
app.use(express.json());

// GET all players from the database
app.get("/api/items", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM players ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// GET a player by ID from the database
app.get("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid player ID" });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM players WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// POST - Add a new player to the database
app.post("/api/items", async (req, res) => {
    const { name, team } = req.body || {};

    if (typeof name !== "string" || typeof team !== "string" ||
        !name.trim() || !team.trim() ||
        name.length > 100 || team.length > 100) {
        return res.status(400).json({
            error: "Valid name and team are required (max 100 characters)"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO players (name, team) VALUES ($1, $2) RETURNING *",
            [name.trim(), team.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// PUT - Update an existing player in the database
app.put("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, team } = req.body || {};

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ error: "Invalid player ID" });
    }

    if (name === undefined && team === undefined) {
        return res.status(400).json({
            error: "Name or team is required"
        });
    }

    if (name !== undefined &&
        (typeof name !== "string" || !name.trim() ||
        name.trim().length > 100)) {
        return res.status(400).json({ error: "Invalid name" });
    }

    if (team !== undefined &&
        (typeof team !== "string" || !team.trim() ||
        team.trim().length > 100)) {
        return res.status(400).json({ error: "Invalid team" });
    }

    let updatedName = null;
    let updatedTeam = null;

    if (name !== undefined) {
        updatedName = name.trim();
    }

    if (team !== undefined) {
        updatedTeam = team.trim();
    }

    try {
        const result = await pool.query(
            `UPDATE players
             SET name = COALESCE($1, name),
                 team = COALESCE($2, team)
             WHERE id = $3
             RETURNING *`,
            [updatedName, updatedTeam, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// DELETE - Remove a player from the database
app.delete("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({
            error: "Invalid player ID"
        });
    }

    try {
        const result = await pool.query(
            "DELETE FROM players WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Player not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});