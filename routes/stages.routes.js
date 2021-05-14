const express = require("express");
const router = express.Router();
const Stage = require("../models/Stage.model");

router.get("/stages", (req, res) => {
  Stage.find()
    .then((stages) => {
      res.status(200).json(stages);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong! Please try again.",
        message: err,
      });
    });
});

router.post("/stage/create", (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  }

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

router.patch("/stage/:stageId/update", (req, res) => {
  const stageId = req.params.stageId;
  const { name } = req.body;

  if (!name) {
    res.status(500).json({
      errorMessage: "Please enter all fields",
    });
    return;
  }

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

router.delete("/stage/:stageId/delete", (req, res) => {
  Stage.findByIdAndDelete(req.params.stageId)
    .then((stage) => {
      res.status(200).json(stage);
    })
    .catch((err) => {
      res.status(500).json({
        error: "Couldn't delete stage! Please try again.",
        message: err,
      });
    });
});

module.exports = router;
