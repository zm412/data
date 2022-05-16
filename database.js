const { Question, Form, Answer, FormInstance } = require("./schema");
class QuestionDb {
  create(obj, form_id) {
    let question = new Question({
      question: obj.question,
      question_type: obj.type,
      description: obj.description,
      form: form_id,
      opts: obj.opts,
    });

    question.save();
    return question;
  }

  get_question_by_form_id(form_id) {
    return Question.find({ form: form_id });
  }
}

class FormDb {
  create(obj) {
    let form = new Form({ title: obj.title, created: obj.created });
    form.save().then((doc) => {
      console.log(doc, "doc");
      for (let key in obj) {
        if (key != "title" && key != "created") {
          let question = new QuestionDb();
          question.create(obj[key], doc._id);
        }
      }
    });
    console.log(form, "result");
    return form;
  }

  getForms() {
    return Form.find({});
  }

  getForm(form_id) {
    let question = new QuestionDb();
    return question.get_question_by_form_id(form_id).populate("form");
  }
  getFormInst(inst_id) {}
}

class AnswerDb {
  create(obj, form_inst_id) {
    let answer = new Answer({
      form_instance: form_inst_id,
      question: obj.question,
      answer: obj.answer,
    });
    answer.save();
    return answer;
  }
}

class FormInstDb {
  create(obj) {
    let answer = new AnswerDb();
    let formInst = new FormInstance({
      form: obj.form,
      created: obj.date,
    });
    formInst.save().then((doc) => {
      console.log(doc, "doc");
      obj.answers.map((el) => {
        console.log(el, "el");
        answer.create(el, doc._id);
      });
    });
    return formInst;
  }

  getFormInst(id) {
    let forminst = FormInstance.find({ _id: id });
    console.log(forminst, "forminst");
    return forminst;
  }
}

module.exports = { FormDb, FormInstDb };
