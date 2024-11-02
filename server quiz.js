
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let users = [];
let quizzes = {};

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users.push({ username, password, attempts: 0, correctAnswers: 0 });
    res.json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Submit quiz endpoint
app.post('/quiz', (req, res) => {
    const { username, score, totalQuestions } = req.body;
    const user = users.find(user => user.username === username);
    if (user) {
        user.attempts += 1;
        user.correctAnswers += score;
        quizzes[username] = {
            username,
            score: user.correctAnswers,
            accuracy: ((user.correctAnswers / (user.attempts * totalQuestions)) * 100).toFixed(2)
        };
        res.json({ accuracy: quizzes[username].accuracy });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Leaderboard endpoint
app.get('/leaderboard', (req, res) => {
    const leaderboard = Object.values(quizzes).sort((a, b) => b.score - a.score);
    res.json(leaderboard);
});

// Profile endpoint
app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);
    if (user) {
        const profile = {
            username: user.username,
            attempts: user.attempts,
            accuracy: ((user.correctAnswers / (user.attempts * 10)) * 100).toFixed(2)
        };
        res.json(profile);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
