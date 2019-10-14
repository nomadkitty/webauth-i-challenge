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
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compare(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}` });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({ message: "Please provide credentials" });
  }
});

router.get("/users", Protected, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.get("/users/:id", Protected, (req, res) => {
  Users.findById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.put("/users/:id", Protected, (req, res) => {
  const changes = req.body;
  const id = req.params.id;

  Users.updateUser({ ...changes }, id)
    .then(updateUser => {
      res.status(200).json(updateUser);
    })
    .catch(err => {
      res.status(500).json({ message: "fail to update user." });
    });
});

router.delete("/users/:id", Protected, (req, res) => {
  const id = req.params.id;
  Users.deleteUser(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ removed: deleted });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete user." });
    });
});

module.exports = router;
