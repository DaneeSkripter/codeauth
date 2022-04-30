const express = require('express')
const app = express()
const config = require('./config.json')
const logger = require('./logger')

app.get('/', function (req, res) {
    res.send('test')
})

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/pages/404.html')
})

app.listen(config.port)
logger.success(`Listening on port ${config.port}`)
