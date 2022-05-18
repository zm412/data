const hbs = require("hbs");
const { JSONRPCServer } = require("json-rpc-2.0");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const { Question, Option, Form } = require("./schema");
const app = express();
const http = require("http").createServer(app);
const server = require("./jsonrpc.js");
const cors = require("cors");

var corsOptions = {
  origin: ["https://sitezm412.herokuapp.com/", "http://localhost:5000"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err) {
    if (err) return console.log(err);
  }
);

mongoose.Promise = global.Promise;

var db = mongoose.connection;
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.engine("html", require("hbs").__express);

app.set("view engine", "html");
app.set("views", path.join(__dirname, "dist"));

app.get("/", (req, res) => res.render("index"));

app.options("/json-rpc", function (req, res) {
  console.log(req, "req");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
});

app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.send("ok");
});

app.post("/json-rpc", cors(corsOptions), (req, res) => {
  const jsonRPCRequest = req.body;
  server.receive(req.body).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running, localhost:3000")
);
