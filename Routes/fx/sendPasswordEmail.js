const config = require('./../../config.json');
let nodemailer = require('nodemailer');

module.exports = ( targetEmail, passwordResetKey, cb ) => {

  let email = config.domain + `api/passwordReset/${passwordResetKey}`;

  let transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: config.nodemailer.auth
  });

  let mailOptions = {
    from: config.nodemailer.user,
    to: targetEmail,
    subject: `${config.appName} - Password Reset`,
    html: `<a href="${email}">Click here</a> to reset your password. This link will expire in 1 hour.`
  };

  transporter.sendMail( mailOptions, ( err, info ) => {
    //callback( err, response )

    if ( !err ) {

      cb( err, info.response );

    } else {

      cb( err, info );

      console.log( err );

    }

  });

};
