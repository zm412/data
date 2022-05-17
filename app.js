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
  origin: "http://127.0.0.1:5000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

require("dotenv").config();
const PORT = process.env.PORT;

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

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
let clients = [];

io.on("connection", (socket) => {
  console.log(`Client with id ${socket.id} connected`);
  clients.push(socket.id);

  socket.emit("message", "I'm server");

  socket.on("message", (message) => {
    if (message == "get_form") {
      socket.emit("message", "This is form");
    }
  });

  socket.on("message", (message) => console.log("Message: ", message));

  socket.on("get_forms", (message) => {
    let result = {};
    Form.find({}, "title created", (err, form_inst) => {
      socket.emit("get_forms", form_inst);
      console.log(err, "err");
    });
  });

  socket.on("disconnect", () => {
    clients.splice(clients.indexOf(socket.id), 1);
    console.log(`Client with id ${socket.id} disconnected`);
  });
});

//получение количества активных клиентов
app.get("/clients-count", (req, res) => {
  res.json({
    hlhlhlh: "ljljlj",
  });
});

//отправка сообщения конкретному клиенту по его id
app.post("/client/:id", (req, res) => {
  if (clients.indexOf(req.params.id) !== -1) {
    io.sockets.connected[req.params.id].emit(
      "private message",
      `Message to client with id ${req.params.id}`
    );
    return res.status(200).json({
      message: `Message was sent to client with id ${req.params.id}`,
    });
  } else return res.status(404).json({ message: "Client not found" });
});


*/
//http.listen(process.env.PORT || 5000);
