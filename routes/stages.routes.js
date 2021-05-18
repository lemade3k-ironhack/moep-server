const express = require("express");
const router = express.Router();
const Stage = require("../models/Stage.model");

// custom middleware to validate user input
const isFilledIn = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  } else {
    next();
  }
};

// get all stages
router.get("/stages", (req, res) => {
  Stage.find()
    .then((stages) => {
      res.status(200).json(stages);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong! Please try again.",
        message: err,
      });
    });
});

// create a stage
router.post("/stage/create", isFilledIn, (req, res) => {
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
router.patch("/stage/:stageId/update", isFilledIn, (req, res) => {
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
router.delete("/stage/:stageId/delete", (req, res) => {
  Stage.findByIdAndDelete(req.params.stageId)
    .then((stage) => {
      res.status(200).json(stage);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Couldn't delete stage! Please try again.",
        message: err,
      });
    });
});

// get a stage with concerts (for admin)
router.get("/stage/:stageName", (req, res) => {
  const name = req.params.stageName

  Stage.findOne({name})
    .populate("concerts")
    .then((stage) => {
      res.status(200).json(stage);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong! Please try again.",
        message: err,
      });
    });
});

module.exports = router;
