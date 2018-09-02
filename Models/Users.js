let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true });
let randomstring = require('randomstring');
let Schema = mongoose.Schema;
let numofLoginAttempts = 5;
//new Date(year, month, day, hours, minutes, seconds, milliseconds);
//30 minutes
let betweenLogins = new Date(0, 0, 0, 0, 30, 0, 0);

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
  loginAttempts: {
    type: Array
  },
  ship: {
    name: String,
    url: String
  },
  isAdmin: {
    type: Boolean,
    default: false
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

userSchema.virtual('loginAttemptsLeft').get(() => {

  let attemptsLeft = numofLoginAttempts;
  let timeofCurrentLogin = Date.now();

  console.log( this.loginAttempts );

  //reverse for loop for efficiency
  for ( let i = this.loginAttempts.length-1; i >= 0; i-- ) {

    if ( timeofCurrentLogin - this.loginAttempts[i].date > betweenLogins ) {

      if ( this.loginAttempts[i].success = false ) {
        attemptsLeft--
      }

    } else {

      //break loop once it has reached a login passed the limit
      i = 0;

    }

  }

  return attemptsLeft;

});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');
