const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { organizacaoTabela } = require('../models');
const { grupoSubgrupo } = require('../models');
const { organizacaoTabelaBind } = require('../models');

async function rawSQLExample(req, res) {
    try {
        let id = req.body.idPontuacao
        let nome = req.body.nome
        let valor = req.body.valor
        let quantidadeOuHoraFlag = req.body.quantidadeOuHoraFlag
        let horas = req.body.horas
        let pontuacaoLimite = null
        let cellAddress = req.body.cellAddress
        if(req.body.pontuacaoLimite > 0) {
            pontuacaoLimite = req.body.pontuacaoLimite
        }

        let selectQuery =
            await sequelize.query("SELECT * FROM `organizacaoTabela` where tabelaPontuacaoIdTabelaPontuacao = " + id, { type: QueryTypes.SELECT })

        let insertedQuery =
            await sequelize.query('INSERT INTO "organizacaoTabelaBind"("usuarioIdUsuario", "organizacaoTabelaIdOrganizacaoTabela") VALUES (' + idUsuario + ', ' + subgrupo.dataValues.idOrganizacaoTabela + ')', { type: QueryTypes.INSERT });

        let updateQueryWithMultipleParams =
            await sequelize.query("UPDATE pontuacao SET nome = '" + nome + "', valor = " + valor + ', "quantidadeOuHoraFlag" = ' + quantidadeOuHoraFlag + ', horas = ' + horas + ', "pontuacaoLimite" = ' + pontuacaoLimite + ', "cellAddress" = ' + "'" + cellAddress + "'" + ' WHERE "idPontuacao" = ' + id, { type: QueryTypes.UPDATE })

        let updateQueryWithPreviousQueryParam =
            await sequelize.query(
                `UPDATE
                    "organizacaoTabelaBind"
                SET
                    "pontuacaoAtual" = "pontuacaoAtual" - ` + valorRetirar + `
                WHERE
                    "organizacaoTabelaIdOrganizacaoTabela" = ` + organizacaoTabelaResult[0].dataValues.organizacaoTabelaIdOrganizacaoTabela,
            { type: QueryTypes.UPDATE });

        let deleteQuery =
            await sequelize.query('DELETE from "registroAtividade" WHERE "usuarioIdUsuario" = ' + idUsuario, { type: QueryTypes.DELETE });
        
        res.status(200).json(result);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function sequelizeMultipleNestedRelationshipsQueryExample(req, res) {
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

async function setTimeoutExample(id, grupos) {
    let i = 100;

    grupos.forEach(async newGrupo => {
        i = i + 100;
        let grupoData = {
            tabelaPontuacaoIdTabelaPontuacao: id,
            grupoSubgrupoIdGrupoSubgrupo: newGrupo.grupo.idGrupoSubgrupo,
            pontuacaoMinimaExigida: newGrupo.pontuacaoMinimaExigida,
            valorSaturacao: newGrupo.valorSaturacao,
            levaExcedente: newGrupo.levaExcedente
        }

        setTimeout(async function() {
            await organizacaoTabela.create(grupoData).then(async grupoResult => {
                if(newGrupo.subgrupos.length > 0) {
                    await createSubgruposHandler(grupoResult.idOrganizacaoTabela, newGrupo.subgrupos)
                }
            })
            .catch(error => {        
                console.log(error);
                res.status(500).send(error);
            });
        }, 100 + i)
    });
}

module.exports = {
    rawSQLExample,
    sequelizeMultipleNestedRelationshipsQueryExample,
    setTimeoutExample
}
