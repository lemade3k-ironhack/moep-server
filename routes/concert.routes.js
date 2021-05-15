const express = require("express");
const router = express.Router();
let Concert = require("../models/Concert.model");
let Stage = require("../models/Stage.model");

// Get upcoming shows
router.get("/upcoming", (req, res) => {
  Concert.find()
    .then((concerts) => {
      sorted = concerts.sort((a, b) => {
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

// Get lineup (all concerts/bands)
router.get("/concerts", (req, res) => {
  Concert.find()
    .then((concerts) => {
      sorted = concerts.sort((a, b) => {
        a.bandname > b.bandname ? 1 : b.bandname > a.bandname ? -1 : 0;
      });
      res.status(200).json(sorted);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

// Get all concerts of one stage
router.get("/stages/:stageId/concerts", (req, res) => {
  const { stageId } = req.params;
  Stage.findById(stageId)
    .populate("concerts")
    .then((stage) => {
      res.status(200).json(stage.concerts);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

// custom middleware to validate user input
const isFilledIn = (req, res, next) => {
  const { bandname, day, starttime, endtime } = req.body;

  if (!bandname || !day || !starttime || !endtime) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  } else {
    next();
  }
};

// Create concert
router.post("/stages/:stageId/concerts/create", isFilledIn, (req, res) => {
  const { stageId } = req.params;
  const { bandname, day, starttime, endtime, description, image } = req.body;
  const img = image ? image : "/concertDummy.png";

  Concert.create({
    bandname,
    day,
    starttime,
    endtime,
    description,
    image: img,
    stage: stageId,
  })
    .then((concert) => {
      Stage.findByIdAndUpdate(stageId, {
        $push: { concerts: concert._id },
      }).then(() => res.status(202).json(concert));
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "Band name already taken",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Couldn't create concert! Please try again.",
          message: err,
        });
      }
    });
});

// Get concert details
router.get("/concerts/:concertId", (req, res) => {
  const { concertId } = req.params;
  Concert.findById(concertId)
    .then((concert) => {
      res.status(200).json(concert);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong. Please try again",
        message: err,
      });
    });
});

module.exports = router;
