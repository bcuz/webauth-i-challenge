const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);

const Users = require('./database/users-model');

const server = express();
const sessionConfig = {
  name: 'monkey',
  secret: 'super secret string',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  },
  store: new SessionStore({
    knex: require('./database/dbConfig'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60 * 60 * 1000,
  }),
}

server.use(session(sessionConfig))

server.use(express.json());

server.get('/api/users', authorize, async (req, res) => {
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

server.post('/api/login', async (req, res) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Need username and password' });
  }

  try {
    let user = await Users.findBy({ username }).first()    

    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;

        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }

    } else {
      res.status(404).json({ message: 'user not found' });
    }

  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  }
});

server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('logged out');
      }
    });
  }
});

async function authorize(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'You are not authorized' });
  }
}

const port = process.env.PORT || 5001;
server.listen(port, function() {
  console.log(`\n=== API Listening on http://localhost:${port} ===\n`);
});