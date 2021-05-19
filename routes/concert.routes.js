const express = require("express");
const router = express.Router();
let Concert = require("../models/Concert.model");
let Stage = require("../models/Stage.model");
// authorize user middleware
const { currentUser, currentAdmin } = require("../middlewares/authorization");

// Get upcoming shows
router.get("/upcoming", currentUser, (req, res) => {
  Concert.find()
    .populate("stage")
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
router.get("/concerts", currentUser, (req, res) => {
  Concert.find()
    .populate("stage")
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

// custom middleware to validate user input
const isFilledIn = (req, res, next) => {
  const { bandname, starttime, endtime } = req.body;

  if (!bandname || !starttime || !endtime) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  } else {
    next();
  }
};

// Create concert
router.post("/stages/:stageId/concerts/create", currentAdmin, isFilledIn, (req, res) => {
  const { stageId } = req.params;
  const { bandname, starttime, endtime, description, image } = req.body;
  const img = image ? image : "/concertDummy.png";
  const newConcert = {
    bandname,
    starttime,
    endtime,
    description,
    image: img,
    stage: stageId,
  };

  Concert.create(newConcert)
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

// Update Concert
router.patch("/concerts/:concertId/update", currentAdmin, isFilledIn, (req, res) => {
  const { concertId } = req.params;
  const { bandname, starttime, endtime, description, image } = req.body;

  Concert.findByIdAndUpdate(
    concertId,
    { bandname, starttime, endtime, description, image },
    { new: true }
  )
    .then((concert) => res.status(200).json(concert))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "New bandname already taken",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Couldn't update concert! Please try again.",
          message: err,
        });
      }
    });
});

// Delete Concert
router.delete("/concerts/:concertId/delete", currentAdmin, (req, res) => {
  const { concertId } = req.params;

  Concert.findByIdAndDelete(concertId)
    .then((concert) => {
      Stage.findByIdAndUpdate(concert.stage, {
        $pull: { concerts: concertId },
      }).then(() => res.status(200).json(concert));
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Couldn't delete concert! Please try again.",
        message: err,
      });
    });
});

// Get concert details
router.get("/concerts/:bandname", currentUser, (req, res) => {
  const { bandname } = req.params;
  Concert.findOne({ bandname })
    .populate("stage")
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
