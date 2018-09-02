'use strict';

module.exports = app => {

  let Register = require('./Register');
  let Login = require('./Login');

  Register( app );
  Login( app );

}
