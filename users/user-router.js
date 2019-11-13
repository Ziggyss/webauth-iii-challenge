const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./user-model');
const router = express.Router();



router.post("/register", (req, res) => {
    const { username, password, department } = req.body;
    const hash = bcrypt.hashSync(password, 11);
    const newUser = {
      username,
      password: hash,
      department,
    };
  
    Users.add(newUser)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json({
          message: "There was an error adding the user: " + error.message
        });
      });
  });

  module.exports = router;