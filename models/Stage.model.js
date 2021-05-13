const { Schema, model } = require("mongoose");

const stageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    concerts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Concert",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Stage = model("Stage", stageSchema);

module.exports = Stage;
