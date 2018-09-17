'use strict';

let Register = require('./Register'),
  Login = require('./Login'),
  verifyEmail = require('./verifyEmail'),
  resendEmail = require('./resendEmail'),
  sendPasswordReset = require('./sendPasswordReset'),
  passwordReset = require('./passwordReset'),
  Me = require('./Me');
//let updateUser = require('./updateUser/index');

module.exports = app => {

  Register( app );
  Login( app );
  verifyEmail( app );
  resendEmail( app );
  sendPasswordReset( app );
  passwordReset( app );
  Me( app );

}
