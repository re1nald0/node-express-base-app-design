"use strict"
// Init the service
var express = require('express');
var service = express();

// Import used libraries and modules
require('dotenv-safe').config();
var logger = require('morgan');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var router = require('./routes');

// Config the service
service.use(logger("dev"));
service.use(cookieParser());
service.use(express.json());
service.use(express.urlencoded({ extended: false }));
service.use(bodyParser.json());
service.use(bodyParser.urlencoded({ extended: true }));
service.use(corsMiddleware);
service.use(express.static(path.join(__dirname, 'public')));

// Config the routing system
service.use('/', router);
service.use((req, res, next) => { //No cache, os requests sao executados toda vez
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next();
});

service.use(function(req, res, next) { // catch 404 and forward to error handler
  next(createError(404));
});

service.use(function(err, req, res, next) { // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.service.get('ENVIRONMENT') === 'development' ? err : {};
  console.log('Path: service.js');
  console.log('----------------------ERROR----------------------');
  console.log(err);
  console.log('-------------------------------------------------');
});

module.exports = service;
