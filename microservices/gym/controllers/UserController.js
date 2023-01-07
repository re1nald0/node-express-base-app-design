const { Op } = require("sequelize");
var _ = require('lodash');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var datetime = require('node-datetime');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { user } = require('../models');


async function login(req, res) {
    try {
        if(req.body.registro != undefined && req.body.password != undefined) {
            await usuario.findOne({
                where: {
                    registro: req.body.registro
                }
            }).then(async result => {
                console.log('---RESULT USUARIO QUERY---')
                console.log(result)

                if(result === null || result === undefined) {
                    res.status(404).send("Nao existe usuario cadastrado com esse registro");
                }
                else {
                    //let resultSTRING = JSON.stringify(result);
                    //let userData = JSON.parse(resultSTRING);
                    //console.log(userData);

                    if(bcrypt.compareSync(req.body.password, result.password)) {
                        var token = jwt.sign({ "idUsuario": result.idUsuario,
                                               "registro": result.registro,
                                               "email": result.email,
                                               "isAdministrador": result.isAdministrador,
                                               "nivelIdNivel": result.nivelIdNivel
                                        }, process.env.SECRET, {
                            expiresIn: 86400
                        });

                        res.status(200).json({ token: token });
                    }
                    else {
                        res.status(401).send("Senha incorreta");
                    }
                }
            }).catch(error => {
                console.log(error);
                res.status(203).send();
            })
        }
        else {
            console.log(error);
            res.status(500).send();
        }
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function validateJwt(req, res) {
    var token = req.headers.authorization;
    //console.log(req.headers.authorization);
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // se tudo estiver ok, salva no request para uso posterior
      res.status(200).send({ auth: true, message: 'Token authenticated' });
    });
}

async function updatePassword(req, res) {
     try {
         const id = req.body.idUsuario
         const oldPassword = req.body.oldPassword
         const newPassword = req.body.newPassword
        
        await usuario.findAll({
            where: {
                idUsuario: id
            }
        }).then(async result => {
            console.log(result[0].dataValues)
            if(bcrypt.compareSync(oldPassword, result[0].dataValues.password)) {
                let newHashedPassword = bcrypt.hashSync(newPassword, 8);
                result.password = newHashedPassword
                
                await usuario.update(result, {
                    where: {
                        idUsuario: id
                    }
                }).then(updatedData => {
                    console.log(updatedData)
                    res.status(200).json(updatedData);
                }).catch(e => {
                    console.log(e);
                    res.status(500).send(e);
                })
            }
            else {
                res.status(401).send("Senha incorreta");
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function checkAdmin(req, res) {
    //console.log(req.body.token);
    var token = req.body.token;

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      console.log('----------TOKEN DECODED---------------')
      console.log(decoded)
      if(decoded.isAdministrador === true) {
        res.status(200).json({
            admin: true,
            idUsuario: decoded.idUsuario,
            registro: decoded.registro,
            email: decoded.email
        });
      }
      else {
        res.status(200).json({
            admin: false,
            idUsuario: decoded.idUsuario,
            registro: decoded.registro,
            email: decoded.email
        });
      }
    });
}

async function getUser(req, res) {
    try {
        await usuario.findAll({
            where: {
                idUsuario: req.params.id
            }
            // include: [
            //     {
            //         model: nivel,
            //         include: [
            //             {
            //             model: classe,
            //             include: [
            //                 {
            //                     model: tipoCarreira
            //                 }
            //             ]
            //             }
            //         ]
            //     }
            // ]
        }).then(result => {
            res.status(200).json(result);
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function getAllUser(req, res) {
    try {
        await usuario.findAll({
            // include: [
            //     {
            //         model: nivel,
            //         include: [
            //             {
            //             model: classe,
            //             include: [
            //                 {
            //                     model: tipoCarreira
            //                 }
            //             ]
            //             }
            //         ]
            //     }
            // ]
        }).then(result => {
            if(result.length <= 0) {
                res.status(404).send("Nao existem usuarios cadastrados");
            }
            else {
                res.status(200).json(result);
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function newUser(req, res) {
    try {
        await usuario.findAll({
            where: {
                [Op.or]: {
                    registro: req.body.registro,
                    email: req.body.email
                }
            }
        }).then(async result => {
            //console.log(result);
            if(result.length > 0) {
                res.status(203).send("Ja existe usuario com esse email ou registro");
            }
            else {
                let encryptedPass = bcrypt.hashSync(req.body.password, 8);
                let newUser = {
                    name: req.body.name,
                    registro: req.body.registro,
                    email: req.body.email,
                    password: encryptedPass,
                    isAdministrador: req.body.isAdministrador
                };

                // if(req.body.nivelIdNivel != undefined) {
                //     newUser.nivelIdNivel = req.body.nivelIdNivel.idNivel;
                // }

                await usuario.create(newUser).then(data => {
                    let parsedData = _.cloneDeep(data.dataValues)
                    let endResult = {
                        idUsuario: parsedData.idUsuario,
                        name: parsedData.name,
                        registro: parsedData.registro,
                        isAdministrador: parsedData.isAdministrador
                        // nivelIdNivel: parsedData.nivelIdNivel
                    }

                    res.status(200).json({"Mensagem": "Usuario criado com sucesso", "data": endResult});
                }).catch(error => {
                    res.status(500).send(error);
                })
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function updateUser(req, res) {
    try {
        console.log(req.body)
        let id = req.body.idUsuario;

        // let updatedUserData = {
        //     name: req.body.name,
        //     registro: req.body.registro,
        //     email: req.body.email,
        //     isAdministrador: req.body.isAdministrador
        // }
        
        // if(req.body.nivelIdNivel != undefined) {
        //         updatedUserData.nivelIdNivel = req.body.nivelIdNivel.idNivel;
        // }
            
        await usuario.findAll({
            where: {
                idUsuario: id
            }
        }).then(async result => {
            if(result.length <= 0) {
                res.status(404).send("Nenhum usuario encontrado no banco");
            }

            result.name = req.body.name;
            result.registro = req.body.registro;
            result.email = req.body.email;
            result.isAdministrador = req.body.isAdministrador;

            if(req.body.password.length > 0) {
                console.log('---PASSWORD---')
                console.log(req.body.password.length)
                let encryptedPass = bcrypt.hashSync(req.body.password, 8);
                result.password = encryptedPass;
            }

            await usuario.update(result, {
                where: {
                    idUsuario: id
                }
            }).then(result => {
                res.status(200).json(result);
            }).catch(error => {
                console.log(error);
                res.status(500).send(error);
            })
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function updateMyData(req, res) {
    try {
        console.log(req.body)
        
        let id = req.body.idUsuario;
        await usuario.findAll({
            where: {
                idUsuario: id
            }
        }).then(async result => {
            if(result.length <= 0) {
                res.status(404).send("Nenhum usuario encontrado no banco");
            }

            result.name = req.body.name;
            result.registro = req.body.registro;
            result.email = req.body.email;

            await usuario.update(result, {
                where: {
                    idUsuario: id
                }
            }).then(result => {
                res.status(200).json(result);
            }).catch(error => {
                console.log(error);
                res.status(500).send(error);
            });
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

async function deleteUser(req, res) {
    try {
        let id = req.body.idUsuario;

        await usuario.findAll({
            where: {
                idUsuario: id
            }
        }).then(async data => {
            if(data.length <= 0) {
                res.status(404).send("Nao existe usuario com este id");
            } else {
                // try {
                    await usuario.destroy({
                        where: {
                            idUsuario: id
                        }
                    }).then(deletedData => {
                        res.status(200).json(deletedData);
                    }).catch(error => {
                        console.log(error);
                        res.status(500).send(error);
                    })
                // }
                // catch(e) {
                //     console.log(e);
                //     res.status(500).send(e);
                // }
            }
        }).catch(error => {
            console.log(error);
            res.status(500).send(error);
        })
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = {
    login,
    validateJwt,
    checkAdmin,
    updatePassword,
    getUser,
    getAllUser,
    newUser,
    updateUser,
    updateMyData,
    deleteUser
}

//-----------------------------------MACROS HE HE HE HE HE------------------------
/*
try {
        
} catch(e) {
    console.log(e);
    res.status(500).send(e);
}
*/