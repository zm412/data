const express = require("express");
const bodyParser = require("body-parser");
const { JSONRPCServer } = require("json-rpc-2.0");
const hbs = require("hbs");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
      console.log("Сервер ожидает подключения...");
    });
  }
);

mongoose.Promise = global.Promise;

const QuestionScheme = new Schema({
  question: String,
  form: { type: Schema.ObjectId, ref: "Form" },
  question_type: {
    type: String,
    enum: ["input", "textarea", "select"],
    required: true,
  },
  description: String,
});

const OptionScheme = new Schema({
  option: String,
  question: {
    type: Schema.ObjectId,
    ref: "Question",
    required: true,
  },
});

const FormScheme = new Schema({
  created: Date,
  title: String,
});

const FormInstScheme = new Schema({
  form: { type: Schema.ObjectId, ref: "Form", required: true },
  created: Date,
});

let Question = mongoose.model("Question", QuestionScheme);
let Option = mongoose.model("Option", OptionScheme);
let Form = mongoose.model("Form", FormScheme);

var db = mongoose.connection;

const server = new JSONRPCServer();

server.addMethod("echo", ({ text }) => {
  console.log(text, "temp");
  return text + 8888;
});

server.addMethod("log", ({ message }) => console.log(message, "message"));

server.addMethod("save_form", (pac) => {
  let answ = pac.form;

  let form = new Form({ title: answ.title, created: answ.created });
  form.save((err) => console.log(err, "err"));

  for (let key in answ) {
    if (key != "title") {
      let question = new Question({
        question: key,
        question_type: answ[key].type,
        description: answ[key].description,
        form: form._id,
      });

      question.save().then((doc) => {
        if (answ[key].type == "select") {
          answ[key].opts.map((el) => {
            let option = new Option({ option: el, question: doc._id });
            option.save((err) => console.log(err, "err"));
          });
        }
      });
    }
  }

  return "wlkjlkjlj";
});

const app = express();

var whitelist = ["*", "http:localhost"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors({ credentials: true, origin: true }));
app.use(express.static(__dirname + "/dist"));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "html");
app.engine("html", require("hbs").__express);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/json-rpc/", (req, res) => {
  //  console.log(req, "req");
  console.log(req.body, "body");

  const jsonRPCRequest = req.body;
  server.receive(req.body).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});
