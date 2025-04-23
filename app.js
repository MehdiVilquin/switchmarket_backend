require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");
const cors = require("cors");

// Vérification de la présence de l'API key NewsAPI
if (!process.env.NEWSAPI_KEY) {
  console.log("\x1b[31m%s\x1b[0m", "⚠️ Attention, AUCUNE API KEY pour newsAPI n'a été configurée dans le .env !!! ⚠️");
  console.log("\x1b[33m%s\x1b[0m", "Les articles provenant de NewsAPI ne seront pas disponibles.");
}

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var additivesRouter = require("./routes/additives");
var labelsRouter = require("./routes/labels");
var contributionsRouter = require("./routes/contributions")
var newsfeedRouter=require("./routes/news")

var app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/additives", additivesRouter);
app.use("/labels", labelsRouter);
app.use("/contributions", contributionsRouter)
app.use("/news", newsfeedRouter)

module.exports = app;
