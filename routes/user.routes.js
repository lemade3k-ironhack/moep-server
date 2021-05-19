const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Stage = require("../models/Stage.model");

// authorize user middleware
const { currentUser } = require("../middlewares/authorization");

// Get user
router.get("/user", currentUser, (req, res, next) => {
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
router.get("/upcoming/favorites", currentUser, (req, res) => {
  User.findById(req.session.loggedInUser._id)
    .populate("concerts")
    .then((user) => {
      // sort upcoming favorites by starttime
      sorted = user.concerts.sort((a, b) => {
        a.starttime > b.starttime ? 1 : b.starttime > a.starttime ? -1 : 0;
      });
      // filter out all older than current time and give back first five
      upcoming = sorted
        .filter((concert) => concert.starttime > new Date())
        .slice(0, 5);

      return upcoming;
    })
    .then((upcoming) => {
      const stageIds = upcoming.map((concert) => concert.stage);

      // find stage for every upcoming and merge result
      Stage.find({ _id: { $in: stageIds } }).then((stages) => {
        let merged = [];

        for (let i = 0; i < upcoming.length; i++) {
          for (let j = 0; j < stages.length; j++) {
            if (upcoming[i].stage.toString() == stages[j]._id.toString()) {
              upcoming[i].stage = stages[j];
              merged.push(upcoming[i]);
            }
          }
        }
        // finally give back the array with the upcomings and they stages
        res.status(200).json(merged);
      });
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

// Update users favorites
router.post("/upcoming/update", currentUser, (req, res) => {
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
