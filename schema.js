let mongoose = require("mongoose");
const { Schema } = require("mongoose");

const QuestionScheme = new Schema({
  question: String,
  form: { type: Schema.ObjectId, ref: "Form" },
  opts: [String],
  question_type: {
    type: String,
    enum: ["input", "textarea", "select"],
    required: true,
  },
  description: String,
});

const FormScheme = new Schema({
  created: Date,
  title: String,
  question: [{ type: Schema.ObjectId, ref: "Question" }],
});

const AnswerScheme = new Schema({
  //form_instance: { type: Schema.ObjectId, ref: "FormInstance" },
  question: { type: Schema.ObjectId, ref: "Question" },
  answer: String,
});

const FormInstScheme = new Schema({
  form: { type: Schema.ObjectId, ref: "Form", required: true },
  answers: [{ type: Schema.ObjectId, ref: "Answer" }],
  created: Date,
});

let Question = mongoose.model("Question", QuestionScheme);
let Form = mongoose.model("Form", FormScheme);
let Answer = mongoose.model("Answer", AnswerScheme);
let FormInstance = mongoose.model("FormInstance", FormInstScheme);

module.exports = { Question, Form, Answer, FormInstance };
