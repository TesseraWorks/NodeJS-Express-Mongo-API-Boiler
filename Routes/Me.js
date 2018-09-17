module.exports = app => {

  app.route('/api/me')
  .get(( req, res ) => {

    if ( !req.user ) {

      res.json({
        auth: false,
        user: false,
        message: 'You are not authenticated',
        redirect: {
          url: '/login',
          timeout: 0
        }
      });

    } else {

      res.json({
        auth: true,
        user: req.user
      });

    }

  })

}
