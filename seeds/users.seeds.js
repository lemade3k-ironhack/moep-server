require("../db");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync("secret123", salt);

const usersSeeds = [
  {
    name: "Ada",
    password: hash,
    passwordConfirmation: hash,
    role: 'admin'
  },
  {
    name: "Alice",
    password: hash,
    passwordConfirmation: hash,
  }
];

const mongoose = require("mongoose");
const User = require("../models/User.model");

User.create(usersSeeds)
  .then(() => {
    console.log(`Seeded database with 3 users. Password is: 'secret123'`);
    mongoose.connection.close();
  })
  .catch(() => console.log("Error while seeding database"));
