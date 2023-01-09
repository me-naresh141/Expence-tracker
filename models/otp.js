let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let otpSchema = new Schema({
  email: { type: String },
  otp: { type: String},
  extime: { type: Number },
});
module.exports = mongoose.model("Otp", otpSchema);
