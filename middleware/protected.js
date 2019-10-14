const bcrypt = require("bcryptjs");

const Users = require("../user/user-model.js");

module.exports = function protected(req, res, next) {
  let { username, password } = req.headers;
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "You can not pass." });
        }
      });
  } else {
    res.status(400).json({ message: "please provide credentials." });
  }
};
