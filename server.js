'use strict';
let path = require('path'),
bodyParser = require('body-parser'),
expressJwt = require('express-jwt'),
expressServer = require('./Routes/index.js'),
socketServer = require('./Sockets/index.js'),
port = process.env.PORT || 3000,
jwtSecret = process.env.JSONSECRET || 'idek man',
//arch export JSONSECRET=thesecret
express = require('express'),
app = express(),
server = require('http').Server(app),
io = require('socket.io')(server);

app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( expressJwt({secret: jwtSecret}) );
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    req.user = false;
    next();
  }
});


expressServer( app );
socketServer( io );

server.listen(port);
console.log(`Listening on http://localhost:${port}/.`);
