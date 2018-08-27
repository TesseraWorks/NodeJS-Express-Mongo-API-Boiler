'use strict';
let path = require('path'),
  bodyParser = require('body-parser'),
  express = require('express'),
  expressServer = require('./Routes/index'),
  socketServer = require('./Sockets/index'),
  port = process.env.PORT || 3000,
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server);

app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

expressServer( app );
socketServer( io );

server.listen(port);
console.log(`Server started at http://localhost/${port}/.`);
