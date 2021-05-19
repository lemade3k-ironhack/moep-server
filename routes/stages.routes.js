const express = require("express");
const router = express.Router();
const Stage = require("../models/Stage.model");
const Concert = require("../models/Concert.model");

// authorize user middleware
const { currentUser, currentAdmin } = require("../middlewares/authorization");

// custom middleware to validate user input
const isFilledIn = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    res.status(500).json({ errorMessage: "Please enter all fields" });
    return;
  } else {
    next();
  }
};

// get all stages
router.get("/stages", currentUser, (req, res) => {
  Stage.find()
    .then((stages) => res.status(200).json(stages))
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong! Please try again.",
        message: err,
      });
    });
});

// create a stage
router.post("/stage/create", currentAdmin, isFilledIn, (req, res) => {
  const { name } = req.body;

  Stage.create({ name })
    .then((stage) => res.status(202).json(stage))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "Stage name already taken",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Couldn't create stage! Please try again.",
          message: err,
        });
      }
    });
});

// update a stage name
router.patch("/stage/:stageId/update", currentAdmin, isFilledIn, (req, res) => {
  const stageId = req.params.stageId;
  const { name } = req.body;

  Stage.findByIdAndUpdate(stageId, { $set: { name: name } }, { new: true })
    .then((stage) => res.status(200).json(stage))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(500).json({
          errorMessage: "New stage name already taken",
          message: err,
        });
      } else {
        res.status(500).json({
          errorMessage: "Couldn't update stage! Please try again.",
          message: err,
        });
      }
    });
});

// delete a stage
router.delete("/stage/:stageId/delete", currentAdmin, (req, res) => {
  Stage.findByIdAndDelete(req.params.stageId)
    .then((stage) => {
      Concert.deleteMany({ stage: stage._id })
        .then(() => console.log("Deleted dependencies"))
        .catch((err) => console.log(err));

      res.status(200).json(stage);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Couldn't delete stage! Please try again.",
        message: err,
      });
    });
});

// get a stage with concerts
router.get("/stage/:stageName", currentUser, (req, res) => {
  const name = req.params.stageName;

  Stage.findOne({ name })
    .populate("concerts")
    .then((stage) => res.status(200).json(stage))
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong! Please try again.",
        message: err,
      });
    });
});

module.exports = router;
