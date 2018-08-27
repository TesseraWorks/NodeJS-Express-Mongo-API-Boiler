let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/');
let randomstring = require('randomstring');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    required: 'Please create a unique username'
  },
  name: {
    first: String,
    last: String
  },
  description: {
    type: String
  },
  email: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationLink: {
    type: String,
    default: randomstring.generate()
  },
  password: {
    type: String
  },
  ip: {
    type: String
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  banned: {
    type: Boolean,
    default: false
  }
});

userSchema.virtual('fullName').get(() => {
  return this.name.first + ' ' + this.name.last;
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');
