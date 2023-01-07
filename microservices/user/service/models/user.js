'use strict'

const list = () => "select * from user;"

const getById = (user_id) => `select * from user where user_id = ${user_id};`

module.exports =  {
    list,
    getById
}