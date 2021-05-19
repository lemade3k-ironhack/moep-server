const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/currentUser");
const User = require("../models/User.model");

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

// Get upcoming favorites
router.get("/upcoming/favorites", isLoggedIn, (req, res) => {
  User.findById(req.session.loggedInUser._id)
    .populate("concerts")
    .then((user) => {
      sorted = user.concerts.sort((a, b) => {
        a.starttime > b.starttime ? 1 : b.starttime > a.starttime ? -1 : 0;
      });
      upcoming = sorted
        .filter((concert) => concert.starttime > new Date())
        .slice(0, 5);
      res.status(200).json(upcoming);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

// Update users favorites
router.post("/upcoming/update", isLoggedIn, (req, res) => {
  const { favorites, concert } = req.body;
  let concerts = [];

  // check if concert is in favorites and build new concert array
  if (favorites.some((favorite) => favorite._id == concert._id)) {
    concerts = favorites.filter((favorite) => {
      return favorite._id !== concert._id;
    });
  } else {
    concerts = favorites.concat(concert);
  }

  User.findByIdAndUpdate(
    req.session.loggedInUser._id,
    { concerts },
    { new: true }
  )
    .populate("concerts")
    .then((user) => res.status(200).json(user.concerts))
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

module.exports = router;
