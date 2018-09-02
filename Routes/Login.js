let bcrypt = require('bcryptjs');
let Users = require('./../Models/Users');
let jwt = require('jsonwebtoken');
let numofLoginAttempts = 5;
//new Date(year, month, day, hours, minutes, seconds, milliseconds);
//30 minutes
let betweenLogins = new Date(0, 0, 0, 0, 30, 0, 0);
let jwtSecret = process.env.JSONSECRET || 'idek man';
//arch export JSONSECRET=thesecret

function attemptsLeft ( user ) {

  let attemptsLeft = numofLoginAttempts;
  let timeofCurrentLogin = Date.now();

  //reverse for loop for efficiency
  for ( let i = user.loginAttempts.length-1; i >= 0; i-- ) {

    if ( timeofCurrentLogin - user.loginAttempts[i].date > betweenLogins ) {

      if ( user.loginAttempts[i].success === false ) {
        attemptsLeft--
      }

    } else {

      //break loop once it has reached a login passed the limit
      i = 0;

    }

  }

  return attemptsLeft;

}

module.exports = app => {

  app.route('/api/login')
  .post( (req, res) => {

    Users.find(
      {$or: [{username: req.body.username}, {email: req.body.username}]},
      ( err, docs ) => {

        if ( docs.length > 0 ) {

          if ( docs.length > 1 ) {
            //more than 2 users with the same email or username?

            res.json({
              auth: false,
              message: 'There are multiple users with that email or username, please contact the administrator.',
              user: req.user
            })

          } else {

            let passwordValid = false;

            if ( (typeof req.body.password) == 'string' ) {
              passwordValid = bcrypt.compareSync(req.body.password, docs[0].password);
            }

            Users.findOneAndUpdate(
              {_id: docs[0]._id },
              { $push: { loginAttempts: { success: passwordValid, date: Date.now() } } },
              {new: true},
              function ( err, user ) {

                if ( !err ) {

                  let loginsLeft = attemptsLeft( user );

                  if ( loginsLeft <= 0 ) {

                    res.json({
                      auth: false,
                      message: 'This account has been locked due to too many failed login attempts. Please try again later.',
                      user: req.user
                    });

                  } else {

                    if ( passwordValid ) {

                      //do token stuff

                      delete user['password'];
                      delete user['ip'];
                      delete user['email'];
                      delete user['emailVerificationLink'];
                      delete user['loginAttempts'];

                      var token = jwt.sign(user.toJSON(), jwtSecret, {
                        expiresIn: 86400 * 30 // 86400 = 24 hours
                      });

                      res.json({
                        auth: false,
                        token: token,
                        user: req.user,
                        message: 'Login Successful!'
                      });

                    } else {

                      res.json({
                        auth: false,
                        message: `Invalid password. You have ${loginsLeft} login attempts left.`
                      });

                    }

                  }

                } else {

                  res.json({
                    auth: false,
                    message: 'An unknown error has occured.',
                    user: req.user
                  });

                  console.log( err );

                }

              }
            );

          }

        } else {
          //No user was found with this email/username

          res.json({
            auth: false,
            message: 'Invalid username or email.',
            user: req.user
          });

        }

    })

  })

};
