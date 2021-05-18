const { Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    endtime: Date,
  },
  {
    timestamps: true,
  }
);

const News = model("News", newsSchema);

module.exports = News;
