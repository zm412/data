import { JSONRPCClient } from "json-rpc-2.0";
import "./styles.scss";
import "./forms.js";

let url = "/json-rpc/";

const client = new JSONRPCClient((jsonRPCRequest) => {
  //console.log(jsonRPCRequest, "lllll");

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(jsonRPCRequest),
  }).then((response) => {
    console.log(response, "res");
    if (response.status === 200) {
      return response.json().then((jsonRPCResponse) => {
        console.log(jsonRPCResponse, "lkjlkjlkjljl");
        client.receive(jsonRPCResponse);
      });
    } else if (jsonRPCRequest.id !== undefined) {
      console.log(response, "llkjlkjlk");
      return Promise.reject(new Error(response.statusText));
    }
  });
});
/*
client
  .request("echo", { text: "Hello, World!" })
  .then((result) => console.log(result, "res1"));

client.notify("log", { message: "Hello, World!" });
*/
