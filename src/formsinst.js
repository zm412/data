const { ClientForms } = require("../jsonrpc_client.js");

let url = "/json-rpc/";

let client = new ClientForms(url);

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#list_insts")) {
    let id = localStorage.getItem("show_finst");
    client.getFormsInstances(id, listOfInstances);
    client.getForm(id, create_form);
  }
});

function show_descript_form() {
  let par = document.querySelector("#descript_form");
}

function create_form(obj) {
  let par = document.querySelector("#descript_form");
  let str = `<h3>${obj[0].form.title}</h3>`;
  let htmlform = obj.map((el) => {
    str += `<p>${el.question} (${el.description}), type: ${el.question_type} </p>`;
    if (el.question_type == "select") {
      str += `<em>   Options: ${el.opts.join(", ")}</em>`;
    }
    console.log(str, "str");
  });
  par.innerHTML = str;
}
function listOfInstances(obj) {
  console.log(obj, obj);
  let par = document.querySelector("#list_insts");
  obj.map((el) => {
    console.log(el);
    showFormInst(par, el);
  });
}

function createEl(par, tag, inner = null) {
  let elem = par.appendChild(document.createElement(tag));
  tag == "input" ? (elem.value = inner) : (elem.innerHTML = inner);
  return elem;
}

function showFormInst(par, obj) {
  let newdate = new Date(obj.created);
  let newStr =
    newdate.toLocaleDateString() + ", " + newdate.toLocaleTimeString();

  let strhtml = ` <h3>Date: ${newStr}</h3> `;
  let newPart = obj.answers
    ? "<ul>" +
      obj.answers.reduce(
        (str, el) =>
          str +
          `<li>question: ${el.question.question}, answer: ${el.answer}</li>`,
        ""
      ) +
      "</ul>"
    : "";

  par.insertAdjacentHTML("beforeend", strhtml + newPart);
}

/*
function onsubmitForm(e) {
  let elem = document.querySelector("#create_inst");

  e.preventDefault();
  let req = {};
  req.form = e.target.dataset.id;
  req.date = new Date();
  req.answers = [];
  let quests = document.querySelectorAll(".quest");
  Array.from(quests).map((n) => {
    let inner =
      n.tagName == "SELECT"
        ? n.options[n.options.selectedIndex].innerHTML
        : n.value;
    req.answers.push({ question: n.name, answer: inner });
  });
  return req;
}
*/
