let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String, minlength: 5 },
  age: { type: String },
  phone: { type: String },
  country: { type: String },
  profileImage: { type: String },
  profilelink: {type:String},
  provider: [String],
});

userSchema.pre("save", function (next) {
  if (this.password) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      this.password = hashed;
      return next();
    });
  } else {
    return next();
  }
});

// password
userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};
module.exports = mongoose.model("User", userSchema);
