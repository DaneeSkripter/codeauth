const mongoose = require('mongoose')

const codes = new mongoose.Schema({
    code: { type: String },
    page: { type: String }

})
const model = mongoose.model('codes', codes)

module.exports = model