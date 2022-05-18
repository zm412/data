import { JSONRPCClient } from "json-rpc-2.0";

export class ClientForms {
  constructor(url) {
    this.url = url;
  }

  getClient() {
    const client = new JSONRPCClient((jsonRPCRequest) =>
      fetch(this.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonRPCRequest),
      })
        .then((response) => {
          if (response.status === 200) {
            return response
              .json()
              .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
          } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
          }
        })
        .catch((err) => console.log(err, "err"))
    );
    return client;
  }

  saveForm(obj) {
    return this.getClient()
      .request("save_form", obj)
      .then((result) => {});
  }

  getFormsInstances(form_id, func) {
    return this.getClient()
      .request("get_instances_by_formid", form_id)
      .then((result) => {
        func(result);
      });
  }

  getForm(id, func) {
    return this.getClient()
      .request("get_form", id)
      .then((result) => {
        func(result);
      });
  }

  getForms(func) {
    return this.getClient()
      .request("get_forms")
      .then((result) => {
        func(result);
      });
  }

  saveFormInst(obj, func) {
    return this.getClient()
      .request("save_form_inst", obj)
      .then((result) => {
        func(result);
      });
  }

  getFormInst(id, func) {
    return this.getClient()
      .request("get_form_inst", id)
      .then((result) => {
        //func(result);
      });
  }
}
