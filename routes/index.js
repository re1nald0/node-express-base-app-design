"use strict"
// Import the express application kernel modules
var express = require('express');
var router = express.Router();

// Import used libraries
const fs = require('fs');
const path = require('path');
var multer  = require('multer');
var jwt = require('jsonwebtoken');

// Some boostrap scripting
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

// Import modules
const verify_jwt = require('../helpers/verify-jwt');

// Import the application logic wiring
// const models = require('../models');

const userController = require('../controllers/UserController');
const fileController = require('../controllers/FileController');

// Setup the application external interface
try {
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
//----------------SOME CONFIG-------------------------------------------------
  //app.use(verify_jwt);
  // router.get('validate-jwt', usuario.validate_jwt);

  router.get('/', (req, res) => {
    res.status(200).json("Welcome to the Node Express Base App");
  });

//------------------ROUTES----------------------------------------------------
//--------------EXAMPLE ROUTES------------------------------------------------
  router.get('/user/:user_id', userController.getUser);
  router.post('/file-upload', upload.single('file'), fileController.saveFile);
  router.post('/files-upload', upload.array('files'), fileController.saveFiles);

  //-------ROUTE TO ACCESS UPLOADED FILES---------------------------------------
  router.get('/file/:fileName?', (req, res) => {
    if(req.params.fileName === null || req.params.fileName === undefined) {
      res.statusCode = 404;
      return res.end('File not found or you made an invalid request.');
    }

    const filesFolder = path.join(__dirname, '../fileStorage');
    const fileName = req.params.fileName;
    const filePath = path.join(filesFolder, fileName);
    
    fs.readFile(filePath, function(err, data) {
      if(err) {
        res.statusCode = 404;
        return res.end('File not found or you made an invalid request.');
      }
  
      let mediaType = 'application/pdf';
  
      res.setHeader('Content-Type', mediaType);
      res.end(data);
    })
  });
}
catch(e) {
  console.log('Path: route/index.js');
  console.log('----------------------ERROR----------------------');
  console.log(e);
  console.log('-------------------------------------------------');
}

module.exports = router;
