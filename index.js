const express = require('express');
const bcrypt = require('bcryptjs');

const Users = require('./database/users-model');

const server = express();

server.use(express.json());

server.get('/api/users', async (req, res) => {
  try {
      const users = await Users.get();
      res.status(200).json(users);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the users',
    });
  }
});

server.post('/api/register', async (req, res) => {
  let user = req.body;

  if (!user.username || !user.password) {
    return res.status(400).json({ message: 'Need username and password' });
  }

  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash

  try {
    const added = await Users.add(user);
    res.status(201).json(added);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the user',
    });
  }
});

const port = process.env.PORT || 5001;
server.listen(port, function() {
  console.log(`\n=== API Listening on http://localhost:${port} ===\n`);
});