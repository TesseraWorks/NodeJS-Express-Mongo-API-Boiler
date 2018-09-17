let randomstring = require('randomstring'),
  Users = require('../Models/Users'),
  emailValidator = require("email-validator"),
  sendPasswordEmail = require('./fx/sendPasswordEmail');

module.exports = app => {

  //The user wil

  app.route('/api/sendPasswordReset')
  .get(( req, res ) => {

    res.json({
      success: false,
      message: 'Please enter your email.'
    });

  })
  .post(( req, res ) => {

    if ( emailValidator.validate( req.body.email ) ) {

      Users.findOne( { email: req.body.email }, function ( err, user ) {

        if ( !err ) {

          if ( !user ) {

            res.json({
              success: false,
              message: 'The email provided is not registered to any accounts.'
            });

          } else {

            Users.findOneAndUpdate(
              { email: req.body.email },
              { $set: { passwordReset: { key: randomstring.generate(), expiration: ( Date.now() + ( 60 * 60 * 1000 ) ) } } },
              { new: true },
              function ( err, user ) {

                if ( !err ) {

                  sendPasswordEmail( user.email, user.passwordReset.key, ( err, response ) => {

                    if ( !err ) {

                      res.json({
                        success: true,
                        message: 'Check your inbox for the password reset link.'
                      });

                    } else {

                      res.json({
                        success: false,
                        message: 'Unable to send a password reset link to the email provided.'
                      });

                    }

                  })

                } else {

                  res.json({
                    success: false,
                    message: 'An unknown error has occured.'
                  });

                  console.log( err );

                }

              }
            );

          }

        } else {

          res.json({
            success: false,
            message: 'Unable to '
          })

        }

      });

    } else {

      res.json({
        success: false,
        message: 'Please enter a valid email address.'
      })

    }

  })

}
