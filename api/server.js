const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model');

// const authRouter = require('../auth/auth-router.js');
const userRouter = require('../users/user-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

// server.use('/api/auth', authRouter);
// server.use('/api', userRouter);

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.use("/api", userRouter)


module.exports = server;
