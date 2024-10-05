const mongoose = require("mongoose");
const Config = require(".");

const url = Config.DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnection;
