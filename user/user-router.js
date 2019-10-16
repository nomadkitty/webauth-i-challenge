const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./user-model.js");
const Protected = require("../middleware/protected.js");

const router = express.Router();

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      res.status(500).json({ message: "fail to create user." });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compare(password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      res.status(200).json({
        message:
          "you can check out any time you like, but you can never leave!!!",
      });
    });
  } else {
    res.status(200).json({ message: "already logged out" });
  }
});

module.exports = router;
