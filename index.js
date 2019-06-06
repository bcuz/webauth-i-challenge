const express = require('express');

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

const port = process.env.PORT || 5001;
server.listen(port, function() {
  console.log(`\n=== API Listening on http://localhost:${port} ===\n`);
});