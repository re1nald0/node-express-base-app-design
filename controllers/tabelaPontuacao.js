const { tabelaPontuacao, sequelize } = require('../models');
const { organizacaoTabela } = require('../models');
const { saturacaoGrupo } = require('../models');
const { grupoSubgrupo } = require('../models');
const { QueryTypes } = require('sequelize');
const { tabelasUsuarios } = require('../models');
const { organizacaoTabelaBind } = require('../models');
const { registroAtividade } = require('../models');
const { pontuacao } = require('../models');
const { documento } = require('../models');

var fs = require('fs')
var path = require('path')

async function getTabelaPontuacao(req, res) {
    
    try {

        const id = req.params.id
        
        await organizacaoTabela.findAll({
            where: {
                tabelaPontuacaoIdTabelaPontuacao: id
            },
            // order: [
            //     ['idOrganizacaoTabela', 'ASC']
            // ],
            order: [
                ['idOrganizacaoTabela', 'ASC']
            ],
            include: [
                {
                    model: organizacaoTabela,
                    include: [
                        {
                            model: grupoSubgrupo
                        },
                        {
                            model: organizacaoTabelaBind
                        }
                    ]
                    // order: [
                    //     ['idOrganizacaoTabela', 'ASC']
                    // ]
                    // verificar depois em realizar a query na table organizacaoTabela para melhor formato da response
                    // update: comment acima funcionou
                },
                {
                    model: grupoSubgrupo
                },
                {
                    model: organizacaoTabelaBind
                }
            ]
        })
        .then(result => {
            console.log(result)
            res.status(200).json({"result" : result});
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

async function getDesempenhoTabela(req, res) {

    try {

        const id = req.params.id
        const idUsuario = req.params.idUsuario
        
        await organizacaoTabela.findAll({
            where: {
                tabelaPontuacaoIdTabelaPontuacao: id
            },
            order: [
                ['idOrganizacaoTabela', 'ASC']
            ],
            include: [
                {
                    model: organizacaoTabela,
                    include: [
                        {
                            model: grupoSubgrupo
                        },
                        {
                            model: organizacaoTabelaBind,
                            where: {
                                usuarioIdUsuario: idUsuario
                            }
                        }
                    ]
                },
                {
                    model: grupoSubgrupo
                },
                {
                    model: organizacaoTabelaBind,
                    where: {
                        usuarioIdUsuario: idUsuario
                    }
                }
                // Adicionar include documentos
            ]
        })
        .then(result => {
            console.log(result)
            res.status(200).json({"result" : result});
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

async function estruturaTabelaPontuacao(req, res) {

    try {

        const id = req.params.id
        
        const tabelas = await sequelize.query("SELECT * FROM `organizacaoTabela` where tabelaPontuacaoIdTabelaPontuacao = " + id, { type: QueryTypes.SELECT })

        console.log(tabelas)
        res.status(200).json(tabelas)

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function getAllTabelaPontuacao(req, res) {
    
    try {
        
        await tabelaPontuacao.findAll({})
        .then(result => {
            if(result.length <= 0) {
                res.status(404).send("Nao existem tabelas de pontuacao cadastradas");
            }
            else {
                res.status(200).json(result);
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

async function getUserAssociatedTabelasList(req, res) {
    
    try {

        const id = req.params.id;

        await tabelasUsuarios.findAll({
            where: {
                usuarioIdUsuario: id
            }
        })
        .then(async tabelasInfo => {
            let idArray = []

            console.log('----TABELAS INFO CHECK QUERY RESULT-----')
            console.log(tabelasInfo)

            tabelasInfo.forEach(tabela => {
                //console.log(tabela.dataValues.tabelaPontuacaoIdTabelaPontuacao)
                idArray.push(tabela.dataValues.tabelaPontuacaoIdTabelaPontuacao)
            })

            if(tabelasInfo.length <= 0) {
                res.status(404).send("Nao existem tabelas de pontuacao associadas a esse usuario");
            }
            else {
                await tabelaPontuacao.findAll({
                    where: {
                        // verificar formato do array de id's que vem pelo tabelasInfo
                        idTabelaPontuacao: idArray
                    }
                })
                .then(result => {
                    if(result.length <= 0) {
                        res.status(404).send("Nao existem tabelas de pontuacao cadastradas");
                    }
                    else {
                        res.status(200).json(result);
                    }
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

async function getAllUserTabelaPontuacao(req, res) {
    
    try {

        const id = req.params.id;

        await tabelasUsuarios.findAll({
            where: {
                usuarioIdUsuario: id
            }
        })
        .then(async tabelasInfo => {
            let idArray = []

            console.log('----TABELAS INFO CHECK QUERY RESULT-----')
            console.log(tabelasInfo)

            tabelasInfo.forEach(tabela => {
                //console.log(tabela.dataValues.tabelaPontuacaoIdTabelaPontuacao)
                idArray.push(tabela.dataValues.tabelaPontuacaoIdTabelaPontuacao)
            })

            if(tabelasInfo.length <= 0) {
                res.status(404).send("Nao existem tabelas de pontuacao associadas a esse usuario");
            }
            else {
                await tabelaPontuacao.findAll({
                    where: {
                        // verificar formato do array de id's que vem pelo tabelasInfo
                        idTabelaPontuacao: idArray
                    }
                })
                .then(result => {
                    if(result.length <= 0) {
                        res.status(404).send("Nao existem tabelas de pontuacao cadastradas");
                    }
                    else {
                        res.status(200).json(result);
                    }
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

async function getUserTabelaAssociada(req, res) {

    try {
        
        const id = req.params.id;

        await tabelasUsuarios.findAll({
            where: {
                usuarioIdUsuario: id
            }
        })
        .then(async tabelasInfo => {
            const idTabelaPontuacao = tabelasInfo[0].dataValues.tabelaPontuacaoIdTabelaPontuacao
            console.log('----TABELAS INFO CHECK QUERY RESULT-----')
            console.log(tabelasInfo)

            if(tabelasInfo.length <= 0) {
                res.status(404).send("Nao existe tabela de pontuacao associada a esse usuario");
            }
            else {
                await tabelaPontuacao.findAll({
                    where: {
                        // verificar formato do array de id's que vem pelo tabelasInfo
                        idTabelaPontuacao: idTabelaPontuacao
                    }
                })
                .then(result => {
                    if(result.length <= 0) {
                        res.status(404).send("Nao existem tabelas de pontuacao cadastradas");
                    }
                    else {
                        res.status(200).json(result);
                    }
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

async function createUserTabelaPontuacaoBinds(idUsuario, idTabelaPontuacao) {

    try {

        await organizacaoTabela.findAll({
            where: {
                tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            },
            include: [
                {
                    model: organizacaoTabela
                }
            ]
        })
        .then(async grupos => {
            // console.log('---RESULT PRIMEIRA QUERY EM createUserTabelaPontuacaoBinds()---')
            // console.log(grupos)

            grupos.forEach(async grupo => {
                let insertedBind = await sequelize.query('INSERT INTO "organizacaoTabelaBind"("usuarioIdUsuario", "organizacaoTabelaIdOrganizacaoTabela") VALUES (' + idUsuario + ', ' + grupo.dataValues.idOrganizacaoTabela + ')', { type: QueryTypes.INSERT });

                //console.log(grupo.dataValues.organizacaoTabelas.length)
                if(grupo.dataValues.organizacaoTabelas.length > 0) {
                    grupo.dataValues.organizacaoTabelas.forEach(async subgrupo => {
                        let insertedBind = await sequelize.query('INSERT INTO "organizacaoTabelaBind"("usuarioIdUsuario", "organizacaoTabelaIdOrganizacaoTabela") VALUES (' + idUsuario + ', ' + subgrupo.dataValues.idOrganizacaoTabela + ')', { type: QueryTypes.INSERT });

                        await pontuacao.findAll({
                            where: {
                                organizacaoTabelaIdOrganizacaoTabela: subgrupo.dataValues.idOrganizacaoTabela
                            }
                        })
                        .then(async result => {
                            if(result.length <= 0) {
                                res.status(404).send("Nao existem pontuacoes cadastradas");
                            }
                            else {
                                console.log('---RESULT QUERY EM PONTUACAO SUBGRUPO---')
                                console.log(result)
                                
                                result.forEach(async pontos => {
                                    let insertedBind = await sequelize.query('INSERT INTO "pontuacaoBind"("pontuacaoIdPontuacao", "usuarioIdUsuario") VALUES (' + pontos.dataValues.idPontuacao + ', ' + idUsuario + ')', { type: QueryTypes.INSERT });
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send(error);
                        })
                    })
                }
                else {
                    await pontuacao.findAll({
                            where: {
                                organizacaoTabelaIdOrganizacaoTabela: grupo.dataValues.idOrganizacaoTabela
                            }
                        })
                        .then(async result => {
                            if(result.length <= 0) {
                                res.status(404).send("Nao existem pontuacoes cadastradas");
                            }
                            else {
                                console.log('---RESULT QUERY EM PONTUACAO GRUPO---')
                                console.log(result)
                                
                                result.forEach(async pontos => {
                                    let insertedBind = await sequelize.query('INSERT INTO "pontuacaoBind"("pontuacaoIdPontuacao", "usuarioIdUsuario") VALUES (' + pontos.dataValues.idPontuacao + ', ' + idUsuario + ')', { type: QueryTypes.INSERT });
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send(error);
                        })
                }
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
        .finally(() => {
            return;
        })

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function atribuirTabelaDeprecated_MultiTabelas(req, res) {

    try {

        const idUsuario = req.body.idUsuario;
        const idTabelaPontuacao = req.body.tabelaPontuacao.idTabelaPontuacao;
        const tabelaData = req.body.tabelaPontuacao

        await tabelasUsuarios.findAll({
            where: {
                usuarioIdUsuario: idUsuario,
                tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            }
        })
        .then(async result => {
            if(result.length <= 0) {
                let tabelaUsuarioData = {
                    usuarioIdUsuario: idUsuario,
                    tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
                };

                await tabelasUsuarios.create(tabelaUsuarioData)
                .then(async result => {
                    await createUserTabelaPontuacaoBinds(idUsuario, idTabelaPontuacao)

                    res.status(200).json({ "message": "tabela de pontuacao atribuida com sucesso", "result": result, "requestTabelaData": tabelaData });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send(error);
                })
            }
            else {
                res.status(406).send({ "message": "esta tabela ja foi atribuida para este usuario"});
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

async function atribuirTabela(req, res) {

    try {

        const idUsuario = req.body.idUsuario;
        const idTabelaPontuacao = req.body.tabelaPontuacao.idTabelaPontuacao;
        const tabelaData = req.body.tabelaPontuacao

        await tabelasUsuarios.findAll({
            where: {
                usuarioIdUsuario: idUsuario
            }
        })
        .then(async result => {
            if(result.length <= 0) {
                let tabelaUsuarioData = {
                    usuarioIdUsuario: idUsuario,
                    tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
                };

                await tabelasUsuarios.create(tabelaUsuarioData)
                .then(async result => {
                    await createUserTabelaPontuacaoBinds(idUsuario, idTabelaPontuacao)

                    res.status(200).json({ "message": "tabela de pontuacao atribuida com sucesso", "result": result, "requestTabelaData": tabelaData });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send(error);
                })
            }
            else {
                res.status(406).send({ "message": "este usuário já está vinculado a uma tabela de pontuação"});
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

async function removeUserTabePontuacaoBinds(idUsuario, idTabelaPontuacao) {

    try {

        await organizacaoTabela.findAll({
            where: {
                tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            },
            include: [
                {
                    model: organizacaoTabela
                }
            ]
        })
        .then(async grupos => {
            // console.log('---RESULT PRIMEIRA QUERY EM createUserTabelaPontuacaoBinds()---')
            // console.log(grupos)

            grupos.forEach(async grupo => {
                let grupoRemovedBind = await sequelize.query('DELETE FROM "organizacaoTabelaBind" WHERE "usuarioIdUsuario" = ' + idUsuario + ' AND "organizacaoTabelaIdOrganizacaoTabela" = ' + grupo.dataValues.idOrganizacaoTabela, { type: QueryTypes.DELETE });

                //console.log(grupo.dataValues.organizacaoTabelas.length)
                if(grupo.dataValues.organizacaoTabelas.length > 0) {
                    grupo.dataValues.organizacaoTabelas.forEach(async subgrupo => {
                        let subgrupoRemovedBind = await sequelize.query('DELETE FROM "organizacaoTabelaBind" WHERE "usuarioIdUsuario" =' + idUsuario + ' AND "organizacaoTabelaIdOrganizacaoTabela" = ' + subgrupo.dataValues.idOrganizacaoTabela, { type: QueryTypes.DELETE });

                        await pontuacao.findAll({
                            where: {
                                organizacaoTabelaIdOrganizacaoTabela: subgrupo.dataValues.idOrganizacaoTabela
                            }
                        })
                        .then(async result => {
                            if(result.length <= 0) {
                                res.status(404).send("Nao existem pontuacoes cadastradas");
                            }
                            else {
                                console.log('---RESULT QUERY EM PONTUACAO SUBGRUPO---')
                                console.log(result)
                                
                                result.forEach(async pontos => {
                                    let pontuacaoRemovedBind = await sequelize.query('DELETE FROM "pontuacaoBind" WHERE "pontuacaoIdPontuacao" = ' + pontos.dataValues.idPontuacao + ' AND "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });

                                    // Remover registros de atividade
                                    let registroAtividadeRemovedBind = await sequelize.query('DELETE FROM "registroAtividade" WHERE "pontuacaoIdPontuacao" = ' + pontos.dataValues.idPontuacao + ' AND "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send(error);
                        })
                    })
                }
                else {
                    await pontuacao.findAll({
                            where: {
                                organizacaoTabelaIdOrganizacaoTabela: grupo.dataValues.idOrganizacaoTabela
                            }
                        })
                        .then(async result => {
                            if(result.length <= 0) {
                                res.status(404).send("Nao existem pontuacoes cadastradas");
                            }
                            else {
                                console.log('---RESULT QUERY EM PONTUACAO GRUPO---')
                                console.log(result)
                                
                                result.forEach(async pontos => {
                                    let pontuacaoRemovedBind = await sequelize.query('DELETE FROM "pontuacaoBind" WHERE "pontuacaoIdPontuacao" = ' + pontos.dataValues.idPontuacao + ' AND "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });

                                    // Remover registros de atividade
                                    let registroAtividadeRemovedBind = await sequelize.query('DELETE FROM "registroAtividade" WHERE "pontuacaoIdPontuacao" = ' + pontos.dataValues.idPontuacao + ' AND "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).send(error);
                        })
                }
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
        .finally(() => {
            return;
        })

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function desvincularTabela(req, res) {

    try {

        const idUsuario = req.body.idUsuario
        const idTabelaPontuacao = req.body.idTabelaPontuacao

        await tabelasUsuarios.destroy({
            where: {
                usuarioIdUsuario: idUsuario,
                tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            }
        })
        .then(async deletedData => {
            await removeUserTabePontuacaoBinds(idUsuario, idTabelaPontuacao)

            res.status(200).json(deletedData);
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

async function newTabelaPontuacao(req, res) {
    
    try {

        // console.log('------------------')
        // console.log(req.body)
        // console.log('------------------')

        //console.log(req.body.newTabelaPontuacao.grupos[1]);
        
        let tabelaPontuacaoData = {
            pontuacaoAprovacao: req.body.newTabelaPontuacao.pontuacaoAprovacao,
            descricao: req.body.newTabelaPontuacao.descricao
            // deliberacaoIdDeliberacao: req.body.deliberacaoIdDeliberacao
        };
    
        await tabelaPontuacao.create(tabelaPontuacaoData)
        .then(async result => {

            const id = result.idTabelaPontuacao

            await createGruposHandler(id, req.body.newTabelaPontuacao.grupos)

            res.status(200).json({ "message": "tabela de pontuacao criada com sucesso", "id": id });
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

async function createGruposHandler(id, grupos) {

    let i = 100;

    grupos.forEach(async newGrupo => {

        console.log(newGrupo)

        let grupoData = {
            tabelaPontuacaoIdTabelaPontuacao: id,
            grupoSubgrupoIdGrupoSubgrupo: newGrupo.grupo.idGrupoSubgrupo,
            pontuacaoMinimaExigida: newGrupo.pontuacaoMinimaExigida,
            valorSaturacao: newGrupo.valorSaturacao,
            levaExcedente: newGrupo.levaExcedente
        }

        console.log(i)
        i = i + 100;

        setTimeout(async function() {

            await organizacaoTabela.create(grupoData)
            .then(async grupoResult => {
                // console.log('-------------------------------')
                // console.log(grupoResult.idOrganizacaoTabela)
                // console.log('-------------------------------')

                // if(newGrupo.saturacoes.length > 0) {
                //     await createSaturacoesHandler(grupoResult.idOrganizacaoTabela, newGrupo.saturacoes)
                // }

                if(newGrupo.subgrupos.length > 0) {
                    await createSubgruposHandler(grupoResult.idOrganizacaoTabela, newGrupo.subgrupos)
                }

            })
            .catch(error => {        
                console.log(error);
                res.status(500).send(error);
            })

        }, 100 + i)
    })
}

async function createSubgruposHandler(idGrupo, subgrupos) {

    let iSub = 0;

    subgrupos.forEach(async newSubgrupo => {

        let subgrupoData = {
            organizacaoTabelaIdOrganizacaoTabela: idGrupo,
            grupoSubgrupoIdGrupoSubgrupo: newSubgrupo.subgrupo.idGrupoSubgrupo,
            pontuacaoMinimaExigida: newSubgrupo.pontuacaoMinimaExigida,
            valorSaturacao: newSubgrupo.valorSaturacao
            // levaExcedente: newSubgrupo.levaExcedente
        }

        iSub = iSub + 10;

        setTimeout(async function() {

            await organizacaoTabela.create(subgrupoData)
            .then(subgrupoResult => {
                console.log(subgrupoResult)
            })
            .catch(error => {        
                console.log(error);
                res.status(500).send(error);
            })

        }, 10 + iSub)
    })
}

// async function createSaturacoesHandler(id, saturacoes) {

//     setTimeout(async function() {

//         saturacoes.forEach(async newSaturacao => {

//             let saturacaoData = {
//                 organizacaoTabelaIdOrganizacaoTabela: id,
//                 valorSaturacao: newSaturacao.valorSaturacao,
//                 inicioPeriodo: newSaturacao.inicioPeriodo,
//                 fimPeriodo: newSaturacao.fimPeriodo
//             }

//             await saturacaoGrupo.create(saturacaoData)
//             .then(saturacaoResult => {
//                 console.log(saturacaoResult)
//             })
//             .catch(error => {        
//                 console.log(error);
//                 res.status(500).send(error);
//             })
//         })
            
//     }, 250)
    
// }

async function updateTabelaPontuacao(req, res) {
    
    try {
        
        let id = req.body.idTabelaPontuacao;

        await tabelaPontuacao.findAll({
            where: {
                idTabelaPontuacao: id
            }
        })
        .then(async data => {
            data.pontuacaoAprovacao = req.body.pontuacaoAprovacao;
            data.descricao = req.body.descricao;

            await tabelaPontuacao.update(data, {
                where: {
                    idTabelaPontuacao: id
                }
            })
            .then(updatedData => {
                res.status(200).json(updatedData);
            })
            .catch(e => {
                console.log(e);
                res.status(500).send(e);
            })
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

async function deleteTabelaPontuacao(req, res) {
    
    try {
        
        let id = req.body.idTabelaPontuacao;

        await tabelaPontuacao.findAll({
            where: {
                idTabelaPontuacao: id
            }
        })
        .then(async data => {
            if(data.length <= 0) {
                res.status(404).send("Nao existe tabela de pontuacao com este id");
            }
            else {
                await tabelaPontuacao.destroy({
                    where: {
                        idTabelaPontuacao: id
                    }
                })
                .then(deletedData => {
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

async function fixCreateGrupoSubgrupoUsuariosBind(idTabelaPontuacao, idOrganizacaoTabela) {

    try {

        await tabelasUsuarios.findAll({
            where: {
             tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            }
        })
        .then(result => {
            // console.log('-----------FIX GRUPO USUARIOS BIND RESULT--------------------')
            // console.log(result)
            if(result.length > 0) {
                result.forEach(async tabelaUsuario => {
                    let bindData = {
                        organizacaoTabelaIdOrganizacaoTabela: idOrganizacaoTabela,
                        usuarioIdUsuario: tabelaUsuario.usuarioIdUsuario
                    }

                    await organizacaoTabelaBind.create(bindData)
                    .then(createdData => {
                        console.log('-----------CREATED DATA BIND FIX--------------------')
                        console.log(createdData)
                    })
                    .catch(e => {
                        console.log(e);
                        return;
                    })
                })
            }

            return;
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

async function createGrupo(req, res) {
    
    try {
        
        let id = req.body.idTabelaPontuacao;

        let grupoData = {
            tabelaPontuacaoIdTabelaPontuacao: id,
            grupoSubgrupoIdGrupoSubgrupo: req.body.grupoSubgrupoIdGrupoSubgrupo,
            pontuacaoMinimaExigida: req.body.pontuacaoMinimaExigida,
            valorSaturacao: req.body.valorSaturacao,
            levaExcedente: req.body.levaExcedente
        }

        await organizacaoTabela.create(grupoData)
            .then(async grupoResult => {
                console.log('-----------CREATE GRUPO RESULT--------------------')
                console.log(grupoResult.idOrganizacaoTabela)
                console.log('-------------------------------')

                await fixCreateGrupoSubgrupoUsuariosBind(id, grupoResult.idOrganizacaoTabela);

                res.status(200).json({ "message": "grupo criado com sucesso", "data": grupoResult });
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

async function createSubgrupo(req, res) {
    
    try {
        
        let id = req.body.organizacaoTabelaIdOrganizacaoTabela;
        let idTabelaPontuacao = req.body.idTabelaPontuacao;

        let subgrupoData = {
            organizacaoTabelaIdOrganizacaoTabela: id,
            grupoSubgrupoIdGrupoSubgrupo: req.body.grupoSubgrupoIdGrupoSubgrupo,
            pontuacaoMinimaExigida: req.body.pontuacaoMinimaExigida,
            valorSaturacao: req.body.valorSaturacao
            // levaExcedente: req.body.levaExcedente
        }

        await organizacaoTabela.create(subgrupoData)
            .then(async subgrupoResult => {
                // console.log('-------------------------------')
                // console.log(grupoResult.idOrganizacaoTabela)
                // console.log('-------------------------------')

                await fixCreateGrupoSubgrupoUsuariosBind(idTabelaPontuacao, subgrupoResult.idOrganizacaoTabela);

                res.status(200).json({ "message": "subgrupo criado com sucesso", "data": subgrupoResult });
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

async function fixDeleteGrupoSubgrupoUsuariosBind(idOrganizacaoTabela) {

    try {

        await organizacaoTabela.findAll({
            where: {
                organizacaoTabelaIdOrganizacaoTabela: idOrganizacaoTabela
            }
        })
        .then(async subgruposResult => {
            if(subgruposResult.length > 0) {
                subgruposResult.forEach(async subgrupo => {
                    // console.log('-------TESTE ID SUBGRUPO---------')
                    // console.log(subgrupo.idOrganizacaoTabela)
                    await organizacaoTabelaBind.destroy({
                        where: {
                            organizacaoTabelaIdOrganizacaoTabela: subgrupo.idOrganizacaoTabela
                        }
                    })
                    .then(subgrupoDeletedData => {
                        console.log('-----------DELETED SUBGRUPO BIND FIX--------------------')
                        console.log(subgrupoDeletedData)
                    })
                    .catch(e => {
                        console.log(e);
                        return;
                    })
                })
            }

            await organizacaoTabelaBind.destroy({
                where: {
                    organizacaoTabelaIdOrganizacaoTabela: idOrganizacaoTabela
                }
            })
            .then(async deletedData => {
                console.log('-----------DELETED BIND FIX--------------------')
                console.log(deletedData)
            })
            .catch(e => {
                console.log(e);
                return;
            })
        })
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            return;
        })
    
    } catch(e) {
        console.log(e);
        return;
    }

}

async function deleteGrupo(req, res) {
    
    try {
        
        let idTabelaPontuacao = req.body.idTabelaPontuacao;
        let id = req.body.idOrganizacaoTabela;

        await fixDeleteGrupoSubgrupoUsuariosBind(id);

        await organizacaoTabela.findAll({
            where: {
                idOrganizacaoTabela: id
            }
        })
        .then(async data => {
            if(data.length <= 0) {
                res.status(404).send("Nao existe grupo com este id");
            }
            else {
                await organizacaoTabela.destroy({
                    where: {
                        idOrganizacaoTabela: id
                    }
                })
                .then(deletedData => {

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

async function isGrupo(req, res) {

    try {
        
        let id = req.params.idOrganizacaoTabela;

        await organizacaoTabela.findAll({
            where: {
                idOrganizacaoTabela: id
            }
        })
        .then(data => {
            if(data.length <= 0) {
                res.status(404).send("Nao existe grupo/subgrupo com este id");
            }
            else {
                console.log('----IS GRUPO CHECK DATA---')
                console.log(data[0].dataValues)

                if(data[0].dataValues.organizacaoTabelaIdOrganizacaoTabela === null) {
                    res.status(200).json({ 'isGrupo': 1 })
                }
                else {
                    res.status(200).json({ 'isGrupo': 0, 'idGrupo': data[0].dataValues.organizacaoTabelaIdOrganizacaoTabela })
                }
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

async function limparDados(req, res) {

    try {
        
        let idUsuario = req.body.idUsuario;
        let idTabelaPontuacao = req.body.idTabelaPontuacao;

        await registroAtividade.findAll({
            where: {
                usuarioIdUsuario: idUsuario
            },
            include: {
                model: documento
            }
        })
        .then(data => {
            data.forEach(registroData => {
                if(registroData.documentos.length > 0) {
                    registroData.documentos.forEach(documentoData => {
                        console.log('---DOCUMENTO DATA---')
                        console.log(documentoData.pathServidor)
                        fs.unlinkSync(documentoData.pathServidor)
                    })
                }
            })
        })
        .then(async () => {
            let registroAtividadeRemoved = await sequelize.query('DELETE from "registroAtividade" WHERE "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });
            let pontuacaoCleanedBind = await sequelize.query('UPDATE "pontuacaoBind" SET "qtAtividadesRealizadas" = 0, "qtHorasRealizadas" = 0 WHERE "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.UPDATE });
            let organizacaoTabelaCleanedBind = await sequelize.query('UPDATE "organizacaoTabelaBind" SET "pontuacaoAtual" = 0 WHERE "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.UPDATE });
        })
        .catch(e => {
            console.log(e);
            res.status(500).send(e);
        })

        

        res.status(200).json({ 'message': 'Cata Cleaned' });

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}


module.exports = {
    getTabelaPontuacao,
    getDesempenhoTabela,
    estruturaTabelaPontuacao,
    getAllTabelaPontuacao,
    getUserTabelaAssociada,
    getUserAssociatedTabelasList,
    getAllUserTabelaPontuacao,
    atribuirTabela,
    desvincularTabela,
    newTabelaPontuacao,
    updateTabelaPontuacao,
    deleteTabelaPontuacao,
    createGrupo,
    createSubgrupo,
    deleteGrupo,
    isGrupo,
    limparDados
}
