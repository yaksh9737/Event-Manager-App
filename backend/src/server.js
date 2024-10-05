const express = require("express");
const path = require("path");
const dbConnection = require("./config/db");
const Config = require("./config");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();
const PORT = Config.PORT || 5000;

// Middleware to parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the uploads folder inside src
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Updated to serve files from src/uploads

// dbConnection
dbConnection();

// api routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err, "server is not Connected");
  }
  console.log(`listening on port : http://localhost:${PORT}`);
});
