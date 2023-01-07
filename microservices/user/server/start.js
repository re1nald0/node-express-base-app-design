#!/usr/bin/env node
"use strict"

// Module dependencies.
var service = require('../service/main');
var debug = require('debug')('api:server');
var http = require('http');
const fs = require('fs');
const path = require('path');

// Get port from environment and store in Express.
var host = process.env.HOST;
var port = normalizePort(process.env.PORT || '3000');
service.set('port', port);

// Create HTTP server.
var server = http.createServer(service);

// Listen on provided port, on all network interfaces.
server.listen(port,  () => {
  console.log(`Web server listening on: http://${host}:${port}`);
});
server.on('error', onError);
server.on('listening', onListening);
process.on('uncaughtException', err => console.error('uncaughtException', err));
process.on('unhandledRejection', err => console.error('unhandledRejection', err));

//-------------------Create a file server to get the documents------------------------
//------------------------------------------------------------------------------------
// const fileServerPort = 9000;
// const fileServerFolder = path.join(__dirname, '../documentosStorage');

// const fileServer = http.createServer(function(request, response) {
//   console.log(request.method + ' ' + request.url);
//   const filepath = path.join(fileServerFolder, request.url);

//   fs.readFile(filepath, function(err, data) {
//     if (err) {
//       response.statusCode = 404;
//       return response.end('File not found or you made an invalid request.');
//     }

//     let mediaType = 'application/pdf';
//     const ext = path.extname(filepath);
//     if (ext.length > 0 && mediaTypes.hasOwnProperty(ext.slice(1))) {
//       mediaType = mediaTypes[ext.slice(1)];
//     }

//     response.setHeader('Content-Type', mediaType);
//     response.end(data);
//   });
// });

// fileServer.on('clientError', function onClientError(err, socket) {
//   console.log('clientError', err);
//   socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
// })

// fileServer.listen(fileServerPort, host, function() {
//   console.log(`File server online at: ${host}:${fileServerPort}`);
// })
//------------------------------------------------------------------------------------

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  var port = parseInt(val, 10);

  if(isNaN(port)) {
    // named pipe
    return val;
  }
  if(port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if(error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch(error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      console.error('Default error:onError():100');
      console.error(error);
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
