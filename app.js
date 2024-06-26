"use strict"
// Init the app
var express = require('express');
var app = express();

// Import used libraries and modules
require('dotenv-safe').config();
var path = require('path');
var logger = require('morgan');
// var cors = require('cors');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var router = require('./routes/index');
const corsMiddleware = require('./middleware/corsMiddleware');

// Config the app
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// Config the routing system
app.use('/', router);
app.use((req, res, next) => { //No cache, os requests sao executados toda vez
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next();
});

app.use(function(req, res, next) { // catch 404 and forward to error handler
  next(createError(404));
});

app.use(function(err, req, res, next) { // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('ENVIRONMENT') === 'development' ? err : {};
  console.log('Path: app.js');
  console.log('----------------------ERROR----------------------');
  console.log(err);
  console.log('-------------------------------------------------');
});

module.exports = app;
