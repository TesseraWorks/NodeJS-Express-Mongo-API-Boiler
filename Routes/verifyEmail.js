let Users = require('../Models/Users');

module.exports = app => {

  app.route('/verify/email/:verificationCode')
    .get( ( req, res ) => {

      if ( !req.params.verificationCode ) {

        res.json({
          verified: false,
          redirect: {
            url: '/',
            timeout: 0
          }
        });

      } else {

        Users.find(
          {emailVerificationLink: req.params.verificationCode},
          ( err, docs ) => {

            if ( !err ) {

                if ( docs.length > 0 ) {

                  if ( docs.length > 1 ) {

                    res.json({
                      verified: false,
                      message: 'There are multiple users with the same activation code... wtf...'
                    });

                  } else {

                      Users.findOneAndUpdate(
                        { emailVerificationLink: req.params.verificationCode },
                        { $set: { emailVerified: true } },
                        {new: true},
                        function ( err, user ) {

                          if ( !err ) {

                            res.json({
                              verified: true,
                              message: 'Your email has been successfully verified.',
                              redirect: {
                                url: '/login',
                                timeout: 3000
                              }
                            });

                          } else {

                            res.json({
                              verified: false,
                              message: 'An unknown error has occured.'
                            });

                            console.log( err );

                          }

                        }
                      )

                  }

                } else {

                  res.json({
                    verified: false,
                    message: 'Invalid verification code.'
                  })

                }

            } else {

              res.json({
                verified: false,
                message: 'An unknown error has occured, please try again later.'
              })

            }

          }
        )

      }

    })

}
