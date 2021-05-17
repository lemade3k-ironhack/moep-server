const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

router.post("/signup", (req, res) => {
  const { name, password, passwordConfirmation } = req.body;

  // -----SERVER SIDE VALIDATION ----------

  if (!name || !password || !passwordConfirmation) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  }

  const myPassRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!myPassRegex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Password needs to have 8 characters, a number and an Uppercase alphabet",
    });
    return;
  }

  if (!(password === passwordConfirmation)) {
    res.status(500).json({
      errorMessage: "Password and Password-Confirmation must match",
    });
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  User.create({ name, password: hash })
    .then((user) => {
      // ensuring that we don't share the hash as well with the user
      user.passwordHash = "***";
      req.session.loggedInUser = user;
      res.status(200).json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "Username already taken",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Couldn't create user! Please try again.",
          message: err,
        });
      }
    });
});

// will handle all POST requests to http:localhost:5005/api/signin
router.post("/signin", (req, res) => {
  const { name, password } = req.body;

  // -----SERVER SIDE VALIDATION ----------
  if (!name || !password) {
    res.status(500).json({
      errorMessage: "Please enter Username and password",
    });
    return;
  }

  User.findOne({ name })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doesItMatch) => {
          if (doesItMatch) {
            user.password = "***";
            req.session.loggedInUser = user;
            res.status(200).json(user);
          }
          //if passwords do not match
          else {
            res.status(500).json({
              errorMessage: "Password or Username incorrect",
            });
            return;
          }
        })
        .catch(() => {
          res.status(500).json({
            errorMessage: "Something went wrong",
          });
          return;
        });
    })
    //throw an error if the user does not exists
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Password or Username incorrect",
        message: err,
      });
      return;
    });
});

// will handle all GET requests to http:localhost:5005/api/logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  // Nothing to send back to the user
  res.status(204).json({});
});

const isLoggedIn = (req, res, next) => {
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized user",
      code: 401,
    });
  }
};

// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser);
});

module.exports = router;
