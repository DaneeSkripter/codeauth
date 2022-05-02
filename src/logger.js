const colors = require('colors')

const success = function(msg) {
    console.log(colors.green('[SUCCESS] ') + msg)
}

const failed = function(msg) {
    console.log(colors.red('[FAILED] ') + msg)
}

const auth = function(msg) {
    console.log(colors.yellow('[AUTH] ') + msg)
}

module.exports.success = success
module.exports.failed = failed
module.exports.auth = auth