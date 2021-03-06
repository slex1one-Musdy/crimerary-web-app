const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const bp = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./Helper/Database/connectDB");
const morgan = require("morgan");

dotenv.config({
  path: path.join(__dirname + "/Config/dotenv/.env"),
});

const PORT = process.env.PORT || 80;
const { CLIENT_URL } = process.env;

//Connect to database;
connectDB();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

//Cors policy for the communicate with front end / back end
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

process.env.NODE_ENV === "development" && app.use(morgan("dev"));
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  "/public/uploads/",
  express.static(path.join(__dirname, "public", "uploads"))
);

const indexRoute = require("./Route/index");

app.use("/api/v1/", indexRoute);

process.env.NODE_ENV === "production" &&
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}.`);
});
