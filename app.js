require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./models/connection");
const cors = require("cors");
const { FRONTEND_URL } = require("./config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productsRouter = require("./routes/products");
var additivesRouter = require("./routes/additives");
var labelsRouter = require("./routes/labels");
const effectsRouter = require("./routes/effects");
var newsRouter = require("./routes/news");

var app = express();

// --- CORS configuration adaptée local/prod ---
const allowedOrigins = [
  "http://localhost:3001",
  "https://switchmarket-frontend.vercel.app",
];

// Ajoute l'origine définie via la variable d'environnement (utile sur Vercel)
if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Autorise les requêtes sans origin (ex: outils internes, tests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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
app.use("/effects", effectsRouter);
app.use("/news", newsRouter);

module.exports = app;
