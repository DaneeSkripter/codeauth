const colors = require('colors')

const success = function(msg) {
    console.log(colors.green('[SUCCESS] ') + msg)
}

module.exports.success = success