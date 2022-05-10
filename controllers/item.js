const { sequelize } = require('../models');
const { item } = require('../models');
const { documento } = require('../models');
const { pontuacao } = require('../models');
const { pontuacaoBind } = require('../models');
const { tabelasUsuarios } = require('../models');
const { organizacaoTabela } = require('../models');
const { organizacaoTabelaBind } = require('../models');
const { QueryTypes } = require('sequelize');
var datetime = require('node-datetime');


async function getItem(req, res) {
    
    try {
        
        await item.findAll({
            where: {
                idItem: req.body.idItem
            }
        })
        .then(result => {
            res.status(200).json(result);
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

async function getAllItem(req, res) {
    
    try {
        
        await item.findAll({
            order: [
                ['descricao', 'ASC']
            ]
        })
        .then(result => {
            if(result.length <= 0) {
                res.status(404).send("Nao existem itens cadastrados");
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

async function getAllGrupoItem(req, res) {
    
    try {
        
        await pontuacao.findAll({
            where: {
                organizacaoTabelaIdOrganizacaoTabela: req.params.id
            },
            include: [
                {
                    model: item
                }
            ]
        })
        .then(result => {
            if(result.length <= 0) {
                res.status(404).send("Nao existem pontuacoes cadastrados");
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

async function getAllSubgrupoItem(req, res) {
    
    try {
        
        await pontuacao.findAll({
            where: {
                organizacaoTabelaIdOrganizacaoTabela: req.params.id
            },
            include: [
                {
                    model: item
                }
            ]
        })
        .then(async result => {
            //console.log(result)
            if(result.length <= 0) {
                res.status(404).send("Nao existem pontuacoes cadastrados");
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

async function getAllGrupoItemBinded(req, res) {
    
    try {
        
        await pontuacao.findAll({
            where: {
                organizacaoTabelaIdOrganizacaoTabela: req.params.id
            },
            include: [
                {
                    model: item
                },
                {
                    model: pontuacaoBind,
                    where: {
                        usuarioIdUsuario: req.params.idUsuario
                    }
                }
            ]
        })
        .then(result => {
            if(result.length <= 0) {
                res.status(404).send("Nao existem pontuacoes cadastrados");
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

async function getAllSubgrupoItemBinded(req, res) {
    
    try {
        
        await pontuacao.findAll({
            where: {
                organizacaoTabelaIdOrganizacaoTabela: req.params.id
            },
            include: [
                {
                    model: item
                },
                {
                    model: pontuacaoBind,
                    where: {
                        usuarioIdUsuario: req.params.idUsuario
                    }
                }
            ]
        })
        .then(async result => {
            //console.log(result)
            if(result.length <= 0) {
                res.status(404).send("Nao existem pontuacoes cadastrados");
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

async function fixCreatePontuacaoUsuarioBind(idTabelaPontuacao, idPontuacao) {

    try {

        await tabelasUsuarios.findAll({
            where: {
                tabelaPontuacaoIdTabelaPontuacao: idTabelaPontuacao
            }
        })
        .then(queryData => {
            if(queryData.length > 0) {
                queryData.forEach(async tabelaUsuario => {
                    let bindData = {
                        pontuacaoIdPontuacao: idPontuacao,
                        usuarioIdUsuario: tabelaUsuario.usuarioIdUsuario
                    }

                    await pontuacaoBind.create(bindData)
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
        })
        .catch(e => {
            console.log(e);
        })
        .finally(() => {
            return;
        })

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function addItemGrupoSubgrupo(req, res) {

    try {

        let idTabelaPontuacao = req.body.idTabelaPontuacao
        let itemData = req.body.itemData
        const idOrganizacaoTabela = req.body.idOrganizacaoTabela

        // console.log(itemData.item.idItem)
        console.log('---ID TABELA PONTUACAO HELPER---')
        console.log(idTabelaPontuacao)

        let pontuacaoData = {
            nome: itemData.nome,
            valor: itemData.valor,
            organizacaoTabelaIdOrganizacaoTabela: idOrganizacaoTabela,
            itemIdItem: itemData.item.idItem,
            quantidadeOuHoraFlag: itemData.quantidadeOuHoraFlag,
            horas: itemData.horas,
            pontuacaoLimite: itemData.pontuacaoLimite,
            cellAddress: itemData.cellAddress,
            idTabelaPontuacaoHelper: idTabelaPontuacao
        }

        await pontuacao.create(pontuacaoData)
        .then(async result => {
            await fixCreatePontuacaoUsuarioBind(idTabelaPontuacao, result.idPontuacao)

            res.status(200).json(result);
        })
        .catch(e => {
            console.log(e);
            res.status(500).send(e);
        })

        //let result = await sequelize.query('INSERT INTO pontuacao(valor, "organizacaoTabelaIdOrganizacaoTabela", "itemIdItem", "quantidadeOuHoraFlag", horas, "pontuacaoLimite") VALUES(' + itemData.valor + ", " + itemData.idOrganizacaoTabela + ", " + itemData.item.idItem + ", " + itemData.quantidadeOuHoraFlag + ", " + itemData.horas + ", " + itemData.pontuacaoLimite + ')', { type: QueryTypes.INSERT })
        //console.log(idTabelaPontuacao)
        
        // await pontuacao.create({itemData})
        // .then(result => {
        //     if(result.length <= 0) {
        //         res.status(404).send("Erro ao adicionar o item no grupo/subgrupo");
        //     }
        //     else {
        //         res.status(200).json(result);
        //     }
        // })
        // .catch(error => {
        //     console.log(error);
        //     res.status(500).send(error);
        // })

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function updateItemGrupoSubgrupo(req, res) {

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

        let result = await sequelize.query("UPDATE pontuacao SET nome = '" + nome + "', valor = " + valor + ', "quantidadeOuHoraFlag" = ' + quantidadeOuHoraFlag + ', horas = ' + horas + ', "pontuacaoLimite" = ' + pontuacaoLimite + ', "cellAddress" = ' + "'" + cellAddress + "'" + ' WHERE "idPontuacao" = ' + id, { type: QueryTypes.UPDATE })
        //console.log(idTabelaPontuacao)
        
        res.status(200).json(result);

    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }

}

async function fixDeletePontuacaoUsuarioBind(idPontuacao, idOrganizacaoTabela, valor, quantidadeOuHoraFlag, horas) {

    try {

        await pontuacaoBind.findAll({
            where: {
                pontuacaoIdPontuacao: idPontuacao
            }
        })
        .then(result => {
            if(result.length > 0) {
                result.forEach(async bind => {
                    await organizacaoTabela.findAll({
                        where: {
                            idOrganizacaoTabela: idOrganizacaoTabela
                        }
                    })
                    .then(async organizacaoTabelaResult => {
                        console.log('-----BIND------')
                        console.log(bind)

                        if(quantidadeOuHoraFlag) {
                            console.log('---QUANTIDADE OU HORA FLAG TRUE----')
                            const horasRelativas = bind.dataValues.qtHorasRealizadas/horas
                            const valorRetirar = valor * horasRelativas

                            let result1 = await sequelize.query('UPDATE "organizacaoTabelaBind" SET "pontuacaoAtual" = "pontuacaoAtual" - ' + valorRetirar + ' WHERE "organizacaoTabelaIdOrganizacaoTabela" = ' + idOrganizacaoTabela, { type: QueryTypes.UPDATE })
                            if(organizacaoTabelaResult[0].dataValues.organizacaoTabelaIdOrganizacaoTabela != null) {
                                console.log('-----ENTROU IF------')
                                let result2 = await sequelize.query('UPDATE "organizacaoTabelaBind" SET "pontuacaoAtual" = "pontuacaoAtual" - ' + valorRetirar + ' WHERE "organizacaoTabelaIdOrganizacaoTabela" = ' + organizacaoTabelaResult[0].dataValues.organizacaoTabelaIdOrganizacaoTabela, { type: QueryTypes.UPDATE })
                            }
                        }
                        else {
                            console.log('---QUANTIDADE OU HORA FLAG FALSE----')
                            console.log(valor)
                            const valorRetirar = valor * bind.dataValues.qtAtividadesRealizadas

                            let result1 = await sequelize.query('UPDATE "organizacaoTabelaBind" SET "pontuacaoAtual" = "pontuacaoAtual" - ' + valorRetirar + ' WHERE "organizacaoTabelaIdOrganizacaoTabela" = ' + idOrganizacaoTabela, { type: QueryTypes.UPDATE })
                            if(organizacaoTabelaResult[0].dataValues.organizacaoTabelaIdOrganizacaoTabela != null) {
                                console.log('-----ENTROU IF------')
                                let result2 = await sequelize.query('UPDATE "organizacaoTabelaBind" SET "pontuacaoAtual" = "pontuacaoAtual" - ' + valorRetirar + ' WHERE "organizacaoTabelaIdOrganizacaoTabela" = ' + organizacaoTabelaResult[0].dataValues.organizacaoTabelaIdOrganizacaoTabela, { type: QueryTypes.UPDATE })
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })

                    await pontuacaoBind.destroy({
                        where: {
                            pontuacaoIdPontuacao: idPontuacao
                        }
                    })
                    .then(finalData => {
                        console.log(finalData)
                    })
                    .catch(e => {
                        console.log(e);
                    })
                })
            }
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

async function deleteItemGrupoSubgrupo(req, res) {

    try {

        let id = req.body.idPontuacao
        const idOrganizacaoTabela = req.body.idOrganizacaoTabela
        const valor = req.body.valor
        const quantidadeOuHoraFlag = req.body.quantidadeOuHoraFlag
        const horas = req.body.horas

        await fixDeletePontuacaoUsuarioBind(id, idOrganizacaoTabela, valor, quantidadeOuHoraFlag, horas)

        //let result = await sequelize.query("INSERT INTO pontuacao(`valor`, `organizacaoTabelaIdOrganizacaoTabela`, `itemIdItem`) VALUES(" + itemData.valor + ", " + itemData.idOrganizacaoTabela + ", " + itemData.item.idItem + ")", { type: QueryTypes.INSERT })
        //console.log(idTabelaPontuacao)
        
        await pontuacao.destroy({
            where: {
                idPontuacao: id
            }
        })
        .then(async result => {
            if(result.length <= 0) {
                res.status(404).send("Erro ao remover o item do grupo/subgrupo");
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

async function newItem(req, res) {
    
    try {
        
        let itemData = {
            descricao: req.body.descricao,
        };
    
        await item.create(itemData)
        .then(result => {
            res.status(200).json({ "message": "item criado com sucesso", "data": result });
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

async function updateItem(req, res) {
    
    try {
        
        let id = req.body.idItem;

        await item.findAll({
            where: {
                idItem: id
            }
        })
        .then(async data => {
            data.descricao = req.body.descricao;

            await item.update(data, {
                where: {
                    idItem: id
                }
            })
            .then(updatedData => {
                //console.log(data);
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

async function deleteItem(req, res) {
    
    try {
        
        let id = req.body.idItem;

        await item.findAll({
            where: {
                idItem: id
            }
        })
        .then(async data => {
            if(data.length <= 0) {
                res.status(404).send("Nao existe item com este id");
            }
            else {
                await item.destroy({
                    where: {
                        idItem: id
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

module.exports = {
    getItem,
    getAllItem,
    getAllGrupoItem,
    getAllSubgrupoItem,
    getAllGrupoItemBinded,
    getAllSubgrupoItemBinded,
    addItemGrupoSubgrupo,
    updateItemGrupoSubgrupo,
    deleteItemGrupoSubgrupo,
    newItem,
    updateItem,
    deleteItem
}
