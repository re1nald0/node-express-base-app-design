const { sequelize } = require('../models');
const { documento } = require('../models');
const { pontuacao } = require('../models');
const { item } = require('../models');
const { organizacaoTabela } = require('../models');
const { grupoSubgrupo } = require('../models');
const { registroAtividade } = require('../models');
const { pontuacaoBind } = require('../models');
const { QueryTypes } = require('sequelize');

var fs = require('fs')
var path = require('path')
const { zip } = require('zip-a-folder');
const ExcelJS = require('exceljs');
// var XLSX = require('xlsx');

async function getDocumentoHandler(req, res) {
    //let path = req.body.path;
    let path = __dirname + '/../documentosStorage/1603860130265-page-backup.txt'
    
    res.download(path);
}

async function enviarDocumento(req, res) {
    try {
        let documentos = req.files
        const idRegistroAtividade = req.body.idRegistroAtividade
        let data = []

        documentos.forEach(async documentoBuffer => {
            const originalName = documentoBuffer.originalname;
            const directoryPath = path.join(__dirname, '../documentosStorage');
            const fileName = Date.now() + '-' + documentoBuffer.originalname;
            const pathServidor = directoryPath + '/' + fileName

            let documentoData = {
                originalName: originalName,
                fileName: fileName,
                pathServidor: pathServidor,
                registroAtividadeIdRegistroAtividade: idRegistroAtividade
            }
            
            fs.appendFile(pathServidor, documentoBuffer.buffer, async function(err) {
                if (err) throw err;
                console.log('Saved!');

                await documento.create(documentoData)
                .then(result => {
                    console.log('---RESULT CREATE DOCUMENTO---');
                    console.log(result);
                    data.push({
                        ...result
                    })
                })
                .catch(error => {
                    fs.unlink(pathServidor, function() {
                        if (err) throw err;
                        console.log('File deleted!');
                    })

                    console.log(error);
                })
            })   
        });

        res.status(200).json(data)
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function removerDocumento(req, res) {
    try {
        const idDocumento = req.body.idDocumento

        await documento.findAll({
            where: {
                idDocumento: idDocumento
            }
        })
        .then(async data => {
            if(data.length <= 0) {
                res.status(404).json({'message': 'documento não encontrado'});
            }
            else {
                console.log('---RESULT QUERY DOCUMENTO ASSOCIADO----')
                console.log(data)
                
                fs.unlinkSync(data[0].dataValues.pathServidor)
                
                await documento.destroy({
                    where: {
                        idDocumento: idDocumento
                    }
                })
                .then(async deletedData => {
                    res.status(200).json(deletedData);
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send(error);
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function salvarDocumentos(idRegistroAtividade, documentos) {
    try {
        documentos.forEach(documentoBuffer => {
            const originalName = documentoBuffer.originalname;
            const directoryPath = path.join(__dirname, '../documentosStorage');
            const fileName = Date.now() + '-' + documentoBuffer.originalname;
            const pathServidor = directoryPath + '/' + fileName

            let documentoData = {
                originalName: originalName,
                fileName: fileName,
                pathServidor: pathServidor,
                registroAtividadeIdRegistroAtividade: idRegistroAtividade
            }
            
            fs.appendFile(pathServidor, documentoBuffer.buffer, async function(err) {
                if (err) throw err;
                console.log('Saved!');

                await documento.create(documentoData)
                .then(result => {
                    console.log('---RESULT CREATE DOCUMENTO---');
                    console.log(result);
                })
                .catch(error => {
                    fs.unlink(pathServidor, function() {
                    if (err) throw err;
                    console.log('File deleted!');
                }) 
                    console.log(error);
                })
            })   
        });
    } catch(e) {
        console.log(e);
        return;
    }
}

async function removerDocumentosAssociados(idRegistroAtividade) {
    try {
        await documento.findAll({
            where: {
                registroAtividadeIdRegistroAtividade: idRegistroAtividade
            }
        })
        .then(async data => {
            if(data.length <= 0) {
                return;
            }
            else {
                data.forEach(documentoData => {
                    console.log('---RESULT QUERY DOCUMENTOS ASSOCIADOS FOREACH----')
                    console.log(documentoData)

                    fs.unlinkSync(documentoData.dataValues.pathServidor)
                })
            }
        })
        .catch(error => {
            console.log('------ERRO DELETAR DOCUMENTOS ASSOCIADOS--------');
            console.log(error);
            return;
        })
        .finally(() => {
            return;
        })
    } catch(e) {
        console.log('------ERRO DELETAR DOCUMENTOS ASSOCIADOS--------');
        console.log(e);
        return;
    }
}

async function checkEnvioDocumentoPendente(req, res) {
    try {
        const idUsuario = req.params.idUsuario;
        const idTabelaPontuacao = req.params.idTabelaPontuacao;

        await registroAtividade.findAll({
            where: {
                usuarioIdUsuario: idUsuario,
                idTabelaPontuacaoHelper: idTabelaPontuacao
            },
            include: [
                {
                    model: documento
                },
                {
                    model: pontuacao,
                    include: {
                        model: item,
                        include: {
                            model: organizacaoTabela,
                            include: {
                                model: grupoSubgrupo
                            }
                        }
                    }
                }
            ]
        }).then(data => {
            res.status(200).json(data)
        }).catch(e => {
            console.log(e);
            res.status(500).send(e);
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function missingDocumentoChecker(idUsuario, idTabelaPontuacao, callback) {
    try {
        let find = null

        await registroAtividade.findAll({
            where: {
                usuarioIdUsuario: idUsuario,
                idTabelaPontuacaoHelper: idTabelaPontuacao
            },
            include: {
                model: documento
            }
        })
        .then(data => {
            data.forEach(registro => {
                if(registro.documentos.length === 0) {
                    find = 1;
                    // callback(-1);
                }
            })

            if(find === null) {
                callback(0)
            }
            else {
                callback(-1);
            }
        })
        .catch(e => {
            console.log(e);
            return;
        })
    } catch(e) {
        console.log(e);
        return;
    }
}

async function generateComprobatoriosFolder(req, res) {
    try {
        const idUsuario = req.params.idUsuario;
        const idTabelaPontuacao = req.params.idTabelaPontuacao;
        // var checkerFlag = null;
        
        missingDocumentoChecker(idUsuario, idTabelaPontuacao, async function(checkerFlag) {
            if (checkerFlag === -1) {
                res.status(204).json({ 'message': 'existem envios pendentes de documentos para registros de atividades' });
            }
            else {
                const directoryPath = path.join(__dirname, '../documentosStorage');
                const rootFolderName = idUsuario + '-' + Date.now() + '-' + 'DocumentosComprobatorios';
                const rootFolderPath = path.join(directoryPath, rootFolderName);

                fs.mkdirSync(rootFolderPath, (err) => {
                    console.log(err)
                    res.status(500).json(err)
                });

                await organizacaoTabela.findAll({
                    where: {
                        tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
                    },
                    include: [
                        {
                            model: grupoSubgrupo
                        },
                        {
                            model: organizacaoTabela,
                            include: [
                                {
                                    model: grupoSubgrupo
                                },
                                {
                                    model: item
                                }
                            ]
                        },
                        {
                            model: item
                        }
                    ]
                })
                .then(grupos => {
                    grupos.forEach(grupo => {
                        fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome, (err) => {
                            console.log(err)
                            res.status(500).json(err)
                        });
                        if(grupo.organizacaoTabelas.length > 0) {
                            grupo.organizacaoTabelas.forEach(subgrupo => {
                                fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + subgrupo.grupoSubgrupo.nome, (err) => {
                                    console.log(err)
                                    res.status(500).json(err)
                                });
                                subgrupo.items.forEach(async item => {
                                    fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + subgrupo.grupoSubgrupo.nome + '/' + item.descricao, (err) => {
                                        console.log(err)
                                        res.status(500).json(err)
                                    });

                                    await registroAtividade.findAll({
                                        where: {
                                            usuarioIdUsuario: idUsuario,
                                            pontuacaoIdPontuacao: item.pontuacao.idPontuacao,
                                            idTabelaPontuacaoHelper: idTabelaPontuacao
                                        },
                                        include: {
                                            model: documento
                                        }
                                    })
                                    .then(atividadeRealizada => {
                                        atividadeRealizada.forEach(atividade => {
                                            let docsFolderName = null
                                            if(atividade.horasConsideradas > 0) {
                                                docsFolderName = atividade.descricao + '(' + atividade.horasConsideradas + '-horas-realizadas)'
                                            }
                                            else {
                                                docsFolderName = atividade.descricao
                                            }

                                            fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + subgrupo.grupoSubgrupo.nome + '/' + item.descricao + '/' + docsFolderName, (err) => {
                                                console.log(err)
                                                res.status(500).json(err)
                                            });

                                            atividade.documentos.forEach(documentoComprobatorio => {
                                                fs.copyFileSync(documentoComprobatorio.pathServidor, rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + subgrupo.grupoSubgrupo.nome + '/' + item.descricao + '/' + docsFolderName + '/' + documentoComprobatorio.originalName)
                                            })
                                        })
                                    })
                                    .catch(e => {
                                        console.log(e);
                                        res.status(500).send(e);
                                    })
                                })
                            })
                        }
                        else {
                            grupo.items.forEach(async item => {
                                fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + item.descricao, (err) => {
                                    console.log(err)
                                    res.status(500).json(err)
                                });

                                await registroAtividade.findAll({
                                    where: {
                                        usuarioIdUsuario: idUsuario,
                                        pontuacaoIdPontuacao: item.pontuacao.idPontuacao,
                                        idTabelaPontuacaoHelper: idTabelaPontuacao
                                    },
                                    include: {
                                        model: documento
                                    }
                                })
                                .then(atividadeRealizada => {
                                    atividadeRealizada.forEach(atividade => {
                                        let docsFolderName = null
                                        if(atividade.horasConsideradas > 0) {
                                            docsFolderName = atividade.descricao + '(' + atividade.horasConsideradas + '-horas-realizadas)'
                                        }
                                        else {
                                            docsFolderName = atividade.descricao
                                        }

                                        fs.mkdirSync(rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + item.descricao + '/' + docsFolderName, (err) => {
                                            console.log(err)
                                            res.status(500).json(err)
                                        });
                                    
                                        atividade.documentos.forEach(documentoComprobatorio => {
                                            fs.copyFileSync(documentoComprobatorio.pathServidor, rootFolderPath + '/' + grupo.grupoSubgrupo.nome + '/' + item.descricao + '/' + docsFolderName + '/' + documentoComprobatorio.originalName)
                                        })
                                    })
                                })
                                .catch(e => {
                                    console.log(e);
                                    res.status(500).send(e);
                                })
                            })
                        }
                    })

                    res.status(200).json({
                        'message': 'pasta com os documentos comprobatorios criada',
                        'folderPath': rootFolderPath,
                        'directoryPath': directoryPath,
                        'rootFolderName': rootFolderName
                    });
                })
                .catch(e => {
                    console.log(e);
                    res.status(500).send(e);
                })
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function downloadComprobatorios(req, res) {
    try {
        const directoryPath = req.body.directoryPath;
        const folderPath = req.body.folderPath;
        
        await zip(folderPath, folderPath + '.zip').then(zippedData => {
            fs.rmdirSync(folderPath, { recursive: true })
            res.download(folderPath + '.zip')
        }).catch(e => {
            console.log(e);
            res.status(500).send(e);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function cleanServerStorage(req, res) {
    try {
        // const directoryPath = req.body.directoryPath;
        const folderPath = req.body.folderPath;

        fs.rmdirSync(folderPath + '.zip', { recursive: true })
        console.log('.zip deleted')

        res.status(200).json({ 'message': '.zip deleted' })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function preencherRelatorio(req, res) {
    try {
        const idUsuario = req.body.idUsuario;
        const idTabelaPontuacao = req.body.idTabelaPontuacao;
        let documento = req.file

        missingDocumentoChecker(idUsuario, idTabelaPontuacao, async function(checkerFlag) {
            console.log('---CHECKER FLAG---');
            console.log(checkerFlag);
            if (checkerFlag === -1) {
                res.status(204).json(
                    {
                        'message': 'existem envios pendentes de documentos para registros de atividades'
                    }
                );
            }
            else {
                const originalName = documento.originalname;
                const fileName = Date.now() + '-' + documento.originalname;
                const directoryPath = path.join(__dirname, '../documentosStorage');
                const pathServidor = directoryPath + '/' + fileName

                fs.appendFile(pathServidor, documento.buffer, async function(err) {
                    if (err) throw err;
                    console.log('Saved!');

                    await pontuacao.findAll({
                        where: {
                            idTabelaPontuacaoHelper: idTabelaPontuacao
                        },
                        include: [
                            {
                                model: pontuacaoBind,
                                where: {
                                    usuarioIdUsuario: idUsuario
                                }
                            },
                            {
                                model: item
                            }
                        ]
                    })
                    .then(async result => {
                        console.log('---RESULT QUERY PONTUACAO---')
                        console.log(result)

                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.readFile(pathServidor);

                        const worksheet = workbook.worksheets[0];

                        result.forEach(pontuacaoData => {
                            const cellAddress = pontuacaoData.dataValues.cellAddress
                            const cell = worksheet.getCell(cellAddress)

                            if(pontuacaoData.dataValues.quantidadeOuHoraFlag === true) {
                                if((pontuacaoData.dataValues.valor * (pontuacaoData.dataValues.pontuacaoBinds[0].dataValues.qtHorasRealizadas/pontuacaoData.dataValues.horas)) > 0) {
                                    var newValue = (pontuacaoData.dataValues.pontuacaoBinds[0].dataValues.qtHorasRealizadas/pontuacaoData.dataValues.horas);
                                    cell.value = parseFloat(newValue);
                                }
                            }
                            else {
                                if((pontuacaoData.dataValues.valor * pontuacaoData.dataValues.pontuacaoBinds[0].dataValues.qtAtividadesRealizadas) > 0) {
                                    var newValue = pontuacaoData.dataValues.pontuacaoBinds[0].dataValues.qtAtividadesRealizadas;
                                    cell.value = parseFloat(newValue);
                                }
                            }

                        })

                        await workbook.xlsx.writeFile(pathServidor);

                        res.download(pathServidor, function (err) {
                            if (err) {
                                console.log('---ERR CALLBACK---')
                                console.log(err)
                            }
                            else {
                                fs.unlink(pathServidor, function() {
                                    if (err) throw err;
                                    console.log('File deleted!');
                                })
                            }
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        res.status(500).send(e);
                    })
                })
            }
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function exportarDados(req, res) {
    try {
        const idUsuario = req.body.idUsuario
        const idTabelaPontuacao = req.body.idTabelaPontuacao
        let fileName = idUsuario + '-data-backup'
        let filePath =  __dirname + '/../documentosStorage/' + fileName

        await registroAtividade.findAll({
            where: {
                usuarioIdUsuario: idUsuario
            }
        })
        .then(data => {
            const {O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_TRUNC, O_APPEND} = require('fs').constants;

            fs.openSync(filePath, O_CREAT, O_RDWR, function(error, fd, data) {
                data.forEach(registroAtividadeData => {
                    console.log('---DATA REGISTRO ATIVIDADE---')
                    console.log(registroAtividadeData)

                    fs.writeSync(fd, registroAtividadeData)
                })
            });
        })
        .catch(e => {
            console.log(e);
            res.status(500).send(e);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}


module.exports = {
    getDocumentoHandler,
    enviarDocumento,
    removerDocumento,
    checkEnvioDocumentoPendente,
    generateComprobatoriosFolder,
    downloadComprobatorios,
    cleanServerStorage,
    preencherRelatorio,
    exportarDados
}
