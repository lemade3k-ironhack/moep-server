const { Schema, model } = require("mongoose");

const concertSchema = new Schema(
   {
      bandname: {
         type: String,
         require: true,
         unique: true,
      },
      starttime: {
         type: Date,
         require: true,
      },
      endtime: {
         type: Date,
         require: true,
      },
      description: {
         type: String,
      },
      image: {
         type: String,
      },
      stage: {
         type: Schema.Types.ObjectId,
         ref: "Stage",
      },
   },
   {
      timestamps: true,
   }
);

const Concert = model("Concert", concertSchema);

module.exports = Concert;
