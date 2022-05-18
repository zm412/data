const { JSONRPCServer } = require("json-rpc-2.0");
const { FormDb, FormInstDb } = require("./database.js");

const server = new JSONRPCServer();
const form = new FormDb();
const formInst = new FormInstDb();

server.addMethod("save_form", (pac) => {
  let obj = pac.form;
  return form.create(obj);
});

server.addMethod("get_forms", () => {
  let all = form.getForms();
  return all;
});

server.addMethod("get_form", (id) => {
  let one = form.getForm(id);
  return one;
});

server.addMethod("save_form_inst", (obj) => {
  let formInstDoc = formInst.create(obj);
  console.log(formInstDoc, "OOOOK");
  return formInstDoc;
});

server.addMethod("get_form_inst", (id) => {
  let formInstDoc = formInst.getFormInst(id);
  console.log(formInstDoc, "idIIII");
  return formInstDoc;
});

module.exports = server;
