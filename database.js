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
      //form_instance: form_inst_id,
      question: obj.question,
      answer: obj.answer,
    });
    answer.save();
    return answer;
  }

  getAnswersByFormInstId(form_inst_id) {
    let answers = Answer.find({ form_instance: form_inst_id })
      //.populate("form_instance")
      .populate("question");
    //.lean()
    //.then((doc) => doc);
    //console.log(answers, "temp");

    return answers;
  }
}

class FormInstDb {
  getFormInst(id) {
    return FormInstance.findById(id)
      .populate("form")
      .populate({
        path: "answers",
        populate: { path: "question" },
      });
  }

  getFormInstancesByFormId(id) {
    return FormInstance.find({ form: id })
      .populate("form")
      .populate({
        path: "answers",
        populate: { path: "question" },
      });
  }

  create(obj) {
    let answer = new AnswerDb();
    let answ_arr = [];
    obj.answers.map((el) => {
      let answ = answer.create(el);
      answ_arr.push(answ._id);
    });
    let formInst = new FormInstance({
      form: obj.form,
      created: obj.date,
      answers: answ_arr,
    });

    formInst.save();
    //let result = this.getFormInst(formInst._id);
    //console.log(result, "res");
    let id = formInst._id;

    return this.getFormInst(id);
  }
}

module.exports = { FormDb, FormInstDb };
