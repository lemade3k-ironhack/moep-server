const express = require("express");
const router = express.Router();
const News = require("../models/News.model");
// authorize user middleware
const { currentUser, currentAdmin } = require("../middlewares/authorization");

// get latest news
router.get("/news", currentUser, (req, res) => {
  News.find()
    .then((news) => {
      const filtered = news.filter((msg) => msg.endtime > new Date());
      const response = filtered.length > 0 ? filtered : null;
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Something went wrong! Please try again.",
        message: err,
      });
    });

  // delete all news with older endtime than current time
  News.deleteMany({ endtime: { $lte: new Date() } })
    .then(() => console.log("Cleaned up news collection"))
    .catch((err) => console.log(err));
});

// custom middleware to validate user input
const isFilledIn = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    res.status(500).json({ errorMessage: "Please enter all fields" });
    return;
  } else {
    next();
  }
};

// create new ticker message
router.post("/news/create", currentAdmin, isFilledIn, (req, res) => {
  const { message, duration } = req.body;
  const newDuration = duration ? duration : 60;

  const newMessage = {
    message: message,
    endtime: new Date(new Date().getTime() + newDuration * 60000),
  };

  News.create(newMessage)
    .then((newNews) => res.status(202).json(newNews))
    .catch((err) => {
      res.status(500).json({
        errorMessage: "Couldn't create news! Please try again.",
        message: err,
      });
    });
});

module.exports = router;
