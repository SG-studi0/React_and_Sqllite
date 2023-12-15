const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(":memory:"); // In-memory SQLite database for demo purposes

db.serialize(() => {
  // Create a simple table
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
});

app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/users", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name });
  });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  db.run("UPDATE users SET name = ? WHERE id = ?", [name, id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json({ id: Number(id), name });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
