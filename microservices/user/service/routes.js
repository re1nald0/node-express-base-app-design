"use strict"
// Import the express application kernel modules
var express = require('express');
var router = express.Router();

// Import used libraries
const fs = require('fs');
const path = require('path');

// Set the application logic wiring (?)
// Models
// const models = require('../models');
// Controllers
const user_controller = require('../controllers/user_controller');

// Setup the application web api interface
try {
//----------------SOME CONFIG-------------------------------------------------
//------------------ROUTES----------------------------------------------------
  router.get('/', (req, res) => {
    res.status(200).json("user_microservice");
  });

//--------------EXAMPLE ROUTES------------------------------------------------
  router.get('/user/:user_id', user_controller.getUser);

//-------ROUTE TO ACCESS UPLOADED FILES---------------------------------------
//----------------TEST ROUTE--------------------------------------------------
  router.get('/test/:parameter', (req, res) => {
    console.log('Path: route/index.js:36');
    console.log('----------------------QUERY----------------------');
    console.log('teste_node query', req.query);
    console.log('----------------------PARAMS----------------------');
    console.log('teste_node params', req.params);
    console.log('----------------------BODY----------------------');
    console.log('teste_node body', req.body);
    console.log('----------------------PATH PARAMETER----------------------');
    console.log(req.params.parametro);
    
    return res.send({
        method: req.method,
        he: req.header,
        q: req.query,
        params: req.params,
        body: req.body,
        message: 'Hey'
    });
  });
}
catch(e) {
  console.log('Path: route/index.js');
  console.log('----------------------ERROR----------------------');
  console.log(e);
  console.log('-------------------------------------------------');
}

module.exports = router;
