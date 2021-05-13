const { Schema, model } = require("mongoose");

const newsSchema = new Schema(
  {
    message: {
      type: String,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

const News = model("News", newsSchema);

module.exports = News;
