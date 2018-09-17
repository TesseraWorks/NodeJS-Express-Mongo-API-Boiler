const config = require('./../../config.json');
let nodemailer = require('nodemailer');

module.exports = ( targetEmail, verifiecationCode, cb ) => {

  let email = config.domain + `verify/email/${verifiecationCode}`;

  let transporter = nodemailer.createTransport({
    service: config.nodemailer.service,
    auth: config.nodemailer.auth
  });

  let mailOptions = {
    from: config.nodemailer.user,
    to: targetEmail,
    subject: `${config.appName} - Please verify your email`,
    html: `<a href="${email}">Click here</a> to verify your email.`
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

}
