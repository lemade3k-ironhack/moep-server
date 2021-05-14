const express = require("express");
const { routes } = require("../app");
const router = express.Router();
let Concert = require("../models/Concert.model");

router.get("/concerts", (req, res) => {
   Concert.find()
      .then((concerts) => {
         res.status(200).json(concerts);
      })
      .catch((err) => {
         res.status(500).json({
            message: err,
         });
      });
});

module.exports = router;
