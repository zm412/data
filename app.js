const hbs = require("hbs");
const { JSONRPCServer } = require("json-rpc-2.0");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const { Question, Option, Form } = require("./schema");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const server = require("./jsonrpc.js");

var corsOptions = {
  origin: "https://sitezm412.herokuapp.com/",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.engine("html", require("hbs").__express);

app.set("view engine", "html");
app.set("views", path.join(__dirname, "dist"));

app.get("/", (req, res) => res.render("index"));
app.post("/json-rpc/", (req, res) => {
  const jsonRPCRequest = req.body;
  server.receive(req.body).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running, localhost:3000")
);
