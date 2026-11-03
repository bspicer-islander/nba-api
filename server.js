const express = require("express");
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

// Store NBA players in memory
let players = [
    { id: 1, name: "Victor Wembanyama", team: "Spurs" },
    { id: 2, name: "Kawhi Leonard", team: "Raptors" },
    { id: 3, name: "Chris Paul", team: "N/A" }
];
let nextId = 4;

// GET all players
app.get("/api/resources", (req, res) => {
    res.json(players);
});

// GET a player by ID
app.get("/api/resources/:id", (req, res) => {
    const id = Number(req.params.id);
    const player = players.find(player => player.id === id);

    if (!player) {
        return res.status(404).json({ error: "Player not found" });
    }

    res.json(player);
});

// POST - Add a new player
app.post("/api/resources", (req, res) => {
    const { name, team } = req.body;

    if (!name || !team) {
        return res.status(400).json({ error: "Name and team are required" });
    }

    const newPlayer = {
        id: nextId,
        name: name,
        team: team
    };

    nextId++;
    players.push(newPlayer);

    res.status(201).json(newPlayer);
});

// PUT - Update an existing player
app.put("/api/resources/:id", (req, res) => {
    const id = Number(req.params.id);
    const player = players.find(player => player.id === id);

    if (!player) {
        return res.status(404).json({ error: "Player not found" });
    }

    if (req.body.name !== undefined) {
        player.name = req.body.name;
    }

    if (req.body.team !== undefined) {
        player.team = req.body.team;
    }

    res.json(player);
});

// DELETE - Remove a player
app.delete("/api/resources/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = players.findIndex(player => player.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Player not found" });
    }

    const removedPlayer = players.splice(index, 1);

    res.json(removedPlayer[0]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});