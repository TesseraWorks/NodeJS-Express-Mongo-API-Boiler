let emailValidator = require("email-validator");
let sendVerificationCode= require('./fx/sendVerificationCode');
let Users = require('../Models/Users');

module.exports = app => {

  app.route('/api/resend/email')
  .get( ( req, res ) => {

    res.json({
      success: false,
      message: 'Please enter your email.'
    });

  })
  .post( ( req, res ) => {

    if ( !req.body.email ) {

      res.json({
        success: false,
        message: 'Please enter your email.'
      });

    } else {

      if ( emailValidator.validate( req.body.email ) ) {

        Users.findOne({ email: req.body.email }, ( err, user ) => {

          if ( !err ) {

            if ( !user ) {

              res.json({
                success: false,
                message: 'There are no accounts registerd with the email provided.'
              });

            } else {

              sendVerificationCode( user.email, user.emailVerificationLink, ( err, response ) => {

                if ( !err ) {

                  res.json({
                    success: true,
                    message: 'Verification link was successfully resent.'
                  });

                } else {

                  res.json({
                    success: false,
                    message: 'Failed to send email to the address provided. Please try again later.'
                  });

                }

              });

            }

          } else {

            res.json({
              success: false,
              message: 'An uknown error has occured'
            });

            console.log( err );

          }

        });

      } else {

        res.json({
          success: false,
          message: 'Invalid email.'
        });

      }

    }

  })

}
