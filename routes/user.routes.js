const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

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

// Get user
router.get("/user", isLoggedIn, (req, res, next) => {
  User.findById(req.session.loggedInUser._id)
    .populate("concerts")
    .then((user) => {
      const filtered = {
        id: user.id,
        name: user.name,
        role: user.role,
        concerts: user.concerts,
      };

      res.status(200).json(filtered);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

module.exports = router;