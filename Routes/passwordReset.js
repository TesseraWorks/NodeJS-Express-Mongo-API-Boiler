let passwordSchema = require('./fx/passwordSchema'),
  bcrypt = require('bcryptjs'),
  Users = require('../Models/Users');

module.exports = app => {

  app.route('/api/passwordReset/:key')
  .get(( req, res ) => {

    res.json({
      success: false,
      message: 'Please enter your password'
    });

  })
  .post(( req, res ) => {

    Users.findOne({ "passwordReset.key": req.params.key }, ( err, user ) => {

      if ( !err ) {

        if ( user.passwordReset.expiration > Date.now() ) {

          if ( req.body.password != null && passwordSchema.validate( req.body.password ) ) {

            let hashedPassword = bcrypt.hashSync(req.body.password, 8);

            Users.findOneAndUpdate(
              { _id: user._id },
              { $set: { password: hashedPassword, passwordReset: { key: '' } } },
              { new: true },
              function ( err, newuser ) {

                if ( !err ) {

                  res.json({
                    success: true,
                    message: 'Your password has been reset successfully!'
                  });

                } else {

                  res.json({
                    success: false,
                    message: 'An unknown error has occured'
                  });

                  console.log( err );

                }

              }
            );

          } else {

            res.json({
              success: false,
              message: 'Password must be between 8 & 64 characters long, contain an upper & lower case letter, and contain at least 1 digit.'
            })

          }

        } else {

          res.json({
            success: false,
            message: 'This password reset link has expired.'
          });

        }

      } else {

        res.json({
          success: false,
          message: 'Invalid password reset link.'
        });

      }

    })

  })

}
