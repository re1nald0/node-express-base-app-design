'use strict'

function myFunction() {
    try {
        res.status(200).end();
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}

module.exports = {
    myFunction
}
