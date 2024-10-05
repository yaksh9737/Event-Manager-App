const dotenv = require("dotenv");

dotenv.config();

const { DB_URL, PORT } = process.env;

const Config = { DB_URL, PORT };

module.exports = Config;
