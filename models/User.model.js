const { Schema, model } = require("mongoose");

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         require: true,
         minLength: 8,
      },
      role: {
         type: String,
         enum: ["admin", "user"],
         default: "user",
      },
      // a users favorites
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

const User = model("User", userSchema);

module.exports = User;
