const express = require("express");
const router = express.Router();
let Concert = require("../models/Concert.model");
let Stage = require("../models/Stage.model");

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
