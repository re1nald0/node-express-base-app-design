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
const models = require('../models');

const usuario = require('../controllers/usuario');
const documentoPessoal = require('../controllers/documentoPessoal');
const tipoCarreira = require('../controllers/tipoCarreira');
const classe = require('../controllers/classe');
const nivel = require('../controllers/nivel');
const item = require('../controllers/item');
const grupoSubgrupo = require('../controllers/grupoSubgrupo');
const deliberacao = require('../controllers/deliberacao');
const tabelaPontuacao = require('../controllers/tabelaPontuacao');
const registroAtividade = require('../controllers/registroAtividade');

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
        body: req.body
    });
  });
//----------------SOME CONFIG-------------------------------------------------
  //app.use(verify_jwt);
  router.get('validate-jwt', usuario.validate_jwt);
  
  router.get('/', (req, res) => {
    res.status(200).json("Welcome to GED System app");
  });
  //-------------------ROUTES-------------------------------------------------

  //--------ROUTE TO ACCESS UPLOADED FILES------------------------------------
  router.get('/files/:fileName?', (req, res) => {
    if(req.params.fileName === null || req.params.fileName === undefined) {
      res.statusCode = 404;
      return res.end('File not found or you made an invalid request.');
    }

    // console.log(request.method + ' ' + req.params.fileName);
    const filesFolder = path.join(__dirname, '../documentosStorage');
    const fileName = req.params.fileName;
    const filepath = path.join(filesFolder, fileName);
    
    fs.readFile(filepath, function(err, data) {
      if (err) {
        res.statusCode = 404;
        return res.end('File not found or you made an invalid request.');
      }
  
      let mediaType = 'application/pdf'; // mimetype
  
      res.setHeader('Content-Type', mediaType);
      res.end(data);
    })
  });

//----------------ROTAS USER-------------------------------------------------
  router.get('/user/:id', usuario.getUser);
  router.get('/allUser', usuario.getAllUser);
  router.post('/newUser', usuario.newUser);
  router.put('/updateUser', usuario.updateUser);
  router.delete('/deleteUser', usuario.deleteUser);

  router.post('/login', usuario.login);
  router.post('/checkAdmin', usuario.checkAdmin);
  router.post('/updatePassword', usuario.updatePassword);

  router.put('/updateMyData', usuario.updateMyData);

//----------------ROTAS DOCUMENTOS PESSOAIS----------------------------------
  router.get('/documentosPessoais/:idUsuario', documentoPessoal.getDocumentosPessoais);
  router.post('/armazenarLattes', upload.single('documento'), documentoPessoal.armazenarLattes);
  router.post('/armazenarPortaria', upload.single('documento'), documentoPessoal.armazenarPortaria);
  router.post('/armazenarDiplomaDoutorLivreDocente', upload.single('documento'), documentoPessoal.armazenarDiplomaDoutorLivreDocente);
  router.delete('/removerDocumentoPessoal', documentoPessoal.removerDocumentoPessoal);

//----------------ROTAS ITEM-------------------------------------------------
  router.get('/item', item.getItem);
  router.get('/allItem', item.getAllItem);
  router.post('/newItem', item.newItem);
  router.put('/updateItem', item.updateItem);
  router.delete('/deleteItem', item.deleteItem);

  router.get('/allGrupoItem/:id', item.getAllGrupoItem);
  router.get('/allSubgrupoItem/:id', item.getAllSubgrupoItem);

  router.get('/allGrupoItem/:id/:idUsuario', item.getAllGrupoItemBinded);
  router.get('/allSubgrupoItem/:id/:idUsuario', item.getAllSubgrupoItemBinded);


  router.post('/addItemGrupoSubgrupo', item.addItemGrupoSubgrupo);
  router.put('/updateItemGrupoSubgrupo', item.updateItemGrupoSubgrupo);
  router.delete('/deleteItemGrupoSubgrupo', item.deleteItemGrupoSubgrupo);

//----------------ROTAS GRUPOS/SUBGRUPOS-------------------------------------
  router.get('/grupoSubgrupo', grupoSubgrupo.getGrupoSubgrupo);
  router.get('/allGrupoSubgrupo', grupoSubgrupo.getAllGrupoSubgrupo);
  router.post('/newGrupoSubgrupo', grupoSubgrupo.newGrupoSubgrupo);
  router.put('/updateGrupoSubgrupo', grupoSubgrupo.updateGrupoSubgrupo);
  router.delete('/deleteGrupoSubgrupo', grupoSubgrupo.deleteGrupoSubgrupo);

  router.get('/allGrupos', grupoSubgrupo.getAllGrupos);
  router.get('/allSubgrupos', grupoSubgrupo.getAllSubgrupos);

//----------------ROTAS DELIBERACAO------------------------------------------
  router.get('/deliberacao/:id', deliberacao.getDeliberacao);
  router.get('/allDeliberacao/', deliberacao.getAllDeliberacao);
  router.post('/newDeliberacao', deliberacao.newDeliberacao);
  router.put('/updateDeliberacao', deliberacao.updateDeliberacao);
  router.delete('/deleteDeliberacao', deliberacao.deleteDeliberacao);

//----------------ROTAS TABELA PONTUACAO-------------------------------------
  router.get('/tabelaPontuacao/:id', tabelaPontuacao.getTabelaPontuacao);
  router.get('/allTabelaPontuacao', tabelaPontuacao.getAllTabelaPontuacao);
  router.get('/userAssociatedTabelasList/:id', tabelaPontuacao.getUserAssociatedTabelasList);
  router.get('/allUserTabelaPontuacao/:id', tabelaPontuacao.getAllUserTabelaPontuacao);
  router.get('/getUserTabelaAssociada/:id', tabelaPontuacao.getUserTabelaAssociada);
  router.post('/newTabelaPontuacao', tabelaPontuacao.newTabelaPontuacao);
  router.put('/updateTabelaPontuacao', tabelaPontuacao.updateTabelaPontuacao);
  router.delete('/deleteTabelaPontuacao', tabelaPontuacao.deleteTabelaPontuacao);

  router.get('/estruturaTabelaPontuacao/:id', tabelaPontuacao.estruturaTabelaPontuacao);
  router.get('/desempenho/:id/:idUsuario', tabelaPontuacao.getDesempenhoTabela);
  router.post('/atribuirTabela', tabelaPontuacao.atribuirTabela);
  router.delete('/desvincularTabela', tabelaPontuacao.desvincularTabela);

  router.post('/createGrupo', tabelaPontuacao.createGrupo);
  router.post('/createSubgrupo', tabelaPontuacao.createSubgrupo);
  router.delete('/deleteGrupo', tabelaPontuacao.deleteGrupo);

  router.get('/isGrupo/:idOrganizacaoTabela', tabelaPontuacao.isGrupo);

//----------------ROTAS REGISTRO ATIVIDADE-----------------------------------
  router.get('/atividadesRegistradas/:id/:idUsuario', registroAtividade.getAtividadesRegistradas);
  router.get('/documentosCount/:id', registroAtividade.getDocumentsCount);
  router.post('/getDocumento', registroAtividade.getDocumentoHandler);
  router.post('/registrarAtividade', upload.array('documentos'), registroAtividade.registrarAtividade);
  router.delete('/removerAtividade', registroAtividade.removerAtividade);
  router.post('/enviarDocumento', upload.array('documentos'), registroAtividade.enviarDocumento);
  router.delete('/removerDocumento', registroAtividade.removerDocumento);

  router.get('/checkEnvioDocumentoPendente/:idUsuario/:idTabelaPontuacao', registroAtividade.checkEnvioDocumentoPendente);
  router.get('/generateComprobatoriosFolder/:idUsuario/:idTabelaPontuacao', registroAtividade.generateComprobatoriosFolder);
  router.post('/downloadComprobatorios', registroAtividade.downloadComprobatorios);
  router.post('/cleanServerStorage', registroAtividade.cleanServerStorage);

  router.post('/preencherRelatorio', upload.single('documento'), registroAtividade.preencherRelatorio);

  router.post('/importarDados', registroAtividade.importarDados);
  router.post('/exportarDados', registroAtividade.exportarDados);
  router.delete('/limparDados', tabelaPontuacao.limparDados);
}
catch(e) {
  console.log('Path: route/index.js');
  console.log('----------------------ERROR----------------------');
  console.log(e);
}

module.exports = router;
