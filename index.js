const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [];
const messages = [];

// Register user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, password: hashedPassword };
  users.push(user);
  res.status(201).json({ id: user.id, username: user.username });
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid username or password' });

  res.json({ id: user.id, username: user.username });
});

// Get messages
app.get('/messages', (req, res) => {
  const { username, to } = req.query;

  if (!username || !to) {
    return res.status(400).json({ error: 'Missing username or recipient (to)' });
  }

  const relevantMessages = messages.filter(
    m =>
      (m.username === username && m.to === to) ||
      (m.username === to && m.to === username)
  );

  res.json(relevantMessages);
});


// Post message
app.post('/messages', (req, res) => {
  const { text, username, to } = req.body;

  const message = {
    id: Date.now().toString(),
    text,
    username,
    to, // Recipient username
    timestamp: new Date().toLocaleString(),
  };

  messages.push(message);
  res.status(201).json(message);
});

// Add some dummy users at startup for testing
const dummyUsers = ['alice', 'bob', 'charlie'];
dummyUsers.forEach(async username => {
  const hashedPassword = await bcrypt.hash('password', 10);
  users.push({ id: Date.now().toString(), username, password: hashedPassword });
});

// Get list of users (excluding passwords)
// Get all registered users
app.get('/users', (req, res) => {
  const userList = users.map(user => ({ username: user.username }));
  res.json(userList);
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));
