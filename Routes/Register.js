'use strict';
let bcrypt = require('bcryptjs'),
  emailValidator = require("email-validator"),
  passwordSchema = require('./fx/passwordSchema'),
  sendVerificationCode = require('./fx/sendVerificationCode');
let Users = require('../Models/Users');

function isAllInfoEntered ( req ) {

  let isInfoFull = 0;

  if ( (typeof req.body.firstName) == 'string' ) {
    isInfoFull++;
  }

  if ( (typeof req.body.lastName) == 'string' ) {
    isInfoFull++;
  }

  if ( ( (typeof req.body.description) == 'string' || req.body.description == null ) ) {
    isInfoFull++;
  }

  if ( (typeof req.body.email) == 'string' ) {
    isInfoFull++;
  }

  if ( (typeof req.body.password) == 'string' ) {
    isInfoFull++;
  }

  if ( ( (typeof req.body.username) == 'string' || (typeof req.body.username) == 'number' ) ) {
    isInfoFull++;
  }

  return isInfoFull == 6;

}

function validateAccount ( req, res, next ) {
  //Make sure the form is filled out completely
  if ( isAllInfoEntered( req ) ) {

    //Check email
    if ( emailValidator.validate( req.body.email ) ) {

      //make sure name isn't too long
      if ( req.body.firstName.length > 50 || req.body.lastName.length > 50 ) {

        res.json({
          auth: false,
          message: 'Your first/last name cannot contain more than 50 characters.'
        });

      } else {
        //make sure description isn't too long

        if ( req.body.description && req.body.description.length > 500 ) {

          res.json({
            auth: false,
            message: 'Description cannot contain more than 500 characters.'
          });

        } else {

          if ( passwordSchema.validate( req.body.password ) ) {
            //Create Account!!!

            checkIfExists( req, res, next )

          } else {

            res.json({
              auth: false,
              message: 'Password must be between 8 & 64 characters long, contain an upper & lower case letter, and contain at least 1 digit.'
            });

          }

        }

      }

    } else {

      res.json({
        auth: false,
        message: 'Please enter a valid email.'
      });

    }

  } else {
    //Information was missing or entered incorrectly

    res.json({
      auth: false,
      message: 'Please fill out all areas marked with *.'
    })

  }
};

function checkIfExists ( req, res, next ) {
    //search for accounts with existing emails/usernames

    //Maybe filter the characters in req.body.username?
    Users.findOne({ username: req.body.username }, ( err, user ) => {

      if ( !err ) {

        if ( !user ) {
          //Check for existing email

          Users.findOne({ email: req.body.email }, ( err, user ) => {

            if ( !err ) {

              if ( !user ) {

                //Create the account

                next();

              } else {

                res.json({
                  auth: false,
                  message: 'The email provided is registed to a different user.'
                })

              }

            } else {

              res.json({
                auth: false,
                message: 'An error has occured.'
              });

            }

          })

        } else {

          res.json({
            auth: false,
            message: 'A user with that username already exists'
          });

        }

      } else {

        res.json({
          auth: false,
          message: 'An error has occured.'
        });

      }

    });

}



module.exports = app => {

  app.route('/api/register')
  .get( (req, res) => {

    res.json({
      auth: false,
      message: 'Register an account.'
    })

  })
  .post( ( req, res ) => {

    validateAccount( req, res, () => {

      let hashedPassword = bcrypt.hashSync(req.body.password, 8);

      Users.create({
          username: req.body.username,
          name: {
            first: req.body.firstName,
            last: req.body.lastName
          },
          description: req.body.description,
          email: req.body.email,
          password: hashedPassword,
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }, ( err, user ) => {

        if ( !err ) {

          //Redirect to login page

          sendVerificationCode( user.email, user.emailVerificationLink, ( err, response ) => {

            if ( !err ) {

              res.json({
                auth: false,
                message: `An verification email has been sent to ${user.email}.`,
                redirect: {
                  url: '/login',
                  name: 'login',
                  timeout: 0
                }
              });

            } else {

              res.json({
                auth: false,
                message: `We are unable to send a verification email to ${user.email}. Please contact the administrator.`,
                redirect: {
                  url: '/login',
                  name: 'login',
                  timeout: 0
                }
              });

            }

          })

        } else {

          res.json({
            auth: false,
            message: 'Account creation failed due to an unknown error.'
          });

        }

      });

    });

  })

}
