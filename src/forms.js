import {
  JSONRPCClient,
  JSONRPCServerAndClient,
  JSONRPCServer,
} from "json-rpc-2.0";

const { ClientForms } = require("../jsonrpc_client.js");
let url = "/json-rpc/";
let client = new ClientForms(url);

let obj = {};

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("#main_form")) {
    client.getForms(createFormsList);
    document.querySelector("#add_form").onclick = () => {
      document.querySelector("#new_form").classList.toggle("hidden_bl");
    };
    document.querySelector("#new_quest").onclick = () => {
      newQuest();
    };
    document.querySelector("#save_f").onclick = getInfo;
  }
});

function addHTMLForm() {
  let par = document.querySelector("#new_form");
  par.innerHTML = `
    <input type="text" id='forms_tl' required placeholder="Form title"><br>
    <div id="quests_list"></div>
    <button id="new_quest">New question</button>
    <div id="create_quest" ></div>

    <div id="new_question"></div>
    <button id='save_f'>Save form</button>
  `;
}

function createFormsList(arr) {
  let list = document.querySelector("#list_f");
  let ul = createEl(list, "ul");
  arr.map((el) => {
    let li = createEl(ul, "li");
    let a = createEl(li, "a", el.title);
    a.href = "/finst_list/";
    a.onclick = (e) => localStorage.setItem("show_finst", el._id);
  });
  return list;
}

function newQuest() {
  document.querySelector("#new_quest").classList.add("hidden_bl");
  let par = document.querySelector("#create_quest");
  par.innerHTML = null;
  par.insertAdjacentHTML(
    "beforeend",
    `
     <select id="quest_type" name="q_type">
        <option value="null">---</option>
        <option value="input">Input</option>
        <option value="textarea">Textarea</option>
        <option value="select">Select</option>
      </select>
  `
  );
  document.querySelector("#quest_type").onchange = getType;
}

function createList(obj) {
  let par = document.querySelector("#quests_list");
  par.innerHTML = null;
  let title = createEl(par, "h3", "Title: " + obj.title);
  let ol = createEl(par, "ol");

  for (let key in obj) {
    if (key != "title" && key != "created") {
      let li = ol.appendChild(document.createElement("li"));
      let opts = obj[key].opts
        ? "<p>Options: </p>" +
          "<ul>" +
          obj[key].opts.reduce((str, el) => str + `<li>${el}</li>`, "") +
          "</ul>"
        : "";
      li.innerHTML = `Question: ${key}, type: ${obj[key].type} ${opts}`;
    }
  }
}

function getInfo() {
  client.saveForm(obj);
  addHTMLForm();
}

function getType(e) {
  let type = e.target.options[e.target.options.selectedIndex].value;

  let par = document.querySelector("#new_question");

  ["input", "textarea", "select"].map((el) => {
    if (type == el) {
      let newElem = createEl(par, "div");
      let newQuest = createEl(newElem, "input");
      let newQuestDesc = createEl(newElem, "input");
      newQuestDesc.placeholder = "Description";
      let br = createEl(newElem, "br");
      newQuest.dataset.type = el;
      newQuest.placeholder = "Question";
      newQuest.required = true;
      let newDiv;
      if (el == "select") {
        let add_opt = createEl(newElem, "button", "Add option");
        newDiv = createEl(newElem, "div");
        add_opt.onclick = () => createEl(newDiv, "input");
      }

      let button_save = createEl(par, "button", "Save question");

      button_save.onclick = () => {
        if (!obj.title) {
          obj.title = document.querySelector("#forms_tl").value;
          obj.created = new Date();
        }

        obj[newQuest.value] = {
          question: newQuest.value,
          type: newQuest.dataset.type,
          description: newQuestDesc.value,
        };

        if (type == "select") {
          obj[newQuest.value].opts = [...newDiv.children].map((el) => el.value);
        }
        document.querySelector("#forms_tl").classList.add("hidden_bl");
        document.querySelector("#add_form").classList.add("hidden_bl");
        document.querySelector("#create_quest").innerHTML = null;
        document.querySelector("#new_question").innerHTML = null;
        document.querySelector("#new_quest").classList.remove("hidden_bl");
        createList(obj);
      };
    }
  });
}

function createEl(par, tag, inner = null) {
  let elem = par.appendChild(document.createElement(tag));
  tag == "input" ? (elem.value = inner) : (elem.innerHTML = inner);
  return elem;
}
