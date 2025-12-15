const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Get chat history
app.get('/api/chat', (req, res) => {
    const sql = "SELECT * FROM messages ORDER BY timestamp ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Save a new message
app.post('/api/chat', (req, res) => {
    const { role, text, sentiment } = req.body;
    const sql = "INSERT INTO messages (role, text, sentiment) VALUES (?,?,?)";
    const params = [role, text, sentiment];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": result,
            "id": this.lastID
        });
    });
});

// Get all transactions
app.get('/api/transactions', (req, res) => {
    const sql = "SELECT * FROM transactions ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// Add a new transaction
app.post('/api/transactions', (req, res) => {
    const { symbol, shares, price_at_purchase } = req.body;
    const sql = "INSERT INTO transactions (symbol, shares, price_at_purchase) VALUES (?,?,?)";
    const params = [symbol, shares, price_at_purchase];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": result,
            "id": this.lastID
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
