let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let incomeSchema = new Schema({
  source: { type: String },
  work: { type: String },
  amount: { type: String },
  date: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Incom", incomeSchema);
