let bcrypt = require('bcryptjs');
let Users = require('../Models/Users');
let jwt = require('jsonwebtoken');
let numofLoginAttempts = 5;
//new Date(year, month, day, hours, minutes, seconds, milliseconds);
//30 minutes
let betweenLogins = 1800000;
let jwtSecret = process.env.JSONSECRET || 'idek man';
//arch export JSONSECRET=thesecret

function attemptsLeft ( user ) {

  let attemptsLeft = numofLoginAttempts;
  let timeofCurrentLogin = Date.now();

  //reverse for loop for efficiency
  for ( let i = user.loginAttempts.length-1; i >= 0; i-- ) {

    console.log(`${timeofCurrentLogin - user.loginAttempts[i].date} ${user.loginAttempts[i].success}`)

    if ( timeofCurrentLogin - user.loginAttempts[i].date < betweenLogins ) {

      if ( user.loginAttempts[i].success === false ) {
        attemptsLeft--;
      }

    } else {

      //break loop once it has reached a login passed the limit
      i = 0;

    }

  }

  return attemptsLeft;

};

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
              message: 'There are multiple users with that email or username, please contact the administrator.'
            })

          } else {

            let passwordValid = false;

            if ( (typeof req.body.password) == 'string' ) {
              passwordValid = bcrypt.compareSync(req.body.password, docs[0].password);
            }

            Users.findOneAndUpdate(
              {_id: docs[0]._id },
              { $push: { loginAttempts: { success: passwordValid, date: Date.now(), ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress } } },
              {new: true},
              function ( err, user ) {

                if ( !err ) {

                  let loginsLeft = attemptsLeft( user );

                  if ( loginsLeft <= 0 ) {

                    res.json({
                      auth: false,
                      message: 'This account has been locked due to too many failed login attempts. Please try again later.'
                    });

                  } else {

                    if ( passwordValid ) {

                      //do token stuff

                      user = user.toObject();
                      delete user.password;
                      delete user.ip;
                      delete user.email;
                      delete user.emailVerificationLink;
                      delete user.loginAttempts;
                      delete user.passwordReset;
                      delete user.__v;
                      delete user.iat;
                      delete user.exp;

                      var token = jwt.sign(user, jwtSecret, {
                        expiresIn: 86400 * 30 // 86400 = 24 hours
                      });

                      res.json({
                        auth: false,
                        token: token,
                        message: 'Login Successful!',
                        user: user
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
                    message: 'An unknown error has occured.'
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
            message: 'Invalid username or email.'
          });

        }

    })

  })

};
