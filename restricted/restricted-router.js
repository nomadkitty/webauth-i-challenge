const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("../user/user-model.js");
const Protected = require("../middleware/protected.js");

const router = express.Router();

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
