const express = require("express");
const bcrypt = require("bcryptjs");
const Users = require("./user-model");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const { username, password, department } = req.body;
  const hash = bcrypt.hashSync(password, 11);
  const newUser = {
    username,
    password: hash,
    department
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

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token: token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/users", (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "THIS IS THE SECRET", (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "bad token" + err.message });
      } else {
        req.decodedToken = decodedToken;
        Users.find()
          .then(users => res.status(200).json(users))
          .catch(err =>
            res.status(500).json({
              message: err.message
            })
          );
      }
    });
  } else {
    res.status(400).json({ message: "You shall not pass!" });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department
  };
  const options = {
    expiresIn: "1d"
  };

  const result = jwt.sign(
    payload,
    // process.env.NODE_ENV === 'development' ? 'devsecret' : process.env.SECRET,
    "THIS IS THE BIT THAT SHOULD BE IN AN ENV FILE SOMEWHERE",
    options
  );

  return result;
}

module.exports = router;
