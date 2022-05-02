const express = require('express')
const app = express()
const config = require('./config.json')
const logger = require('./logger')
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const codeModel = require('./models/codes')

if (!config.mongoose_url) {
    logger.failed('You have to set your MongoDB url.')
} else if (!config.port) {
    logger.failed('You have to set port')
} else {
    mongoose.connect(config.mongoose_url, {
    }).then(() =>[
        logger.success('Connected to database!')
    ]).catch((err) =>{
        logger.failed('Failed connect to the database!')
    })

    app.use(bodyParser.json()); 

    app.use(bodyParser.urlencoded({ extended: true })); 

    app.use(express.static(path.join(__dirname, 'pages')));

      

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/pages/index.html')
    })

    app.post('/usecode', async function (req, res) {
        const code = req.body.code
        const findCode = await codeModel.findOne({ code: code})
        if (!findCode) {
            logger.auth(`User failed authentication with code ${code}`)
            res.sendFile(__dirname + '/pages/wrongcode.html')
        } else {
            logger.auth(`User succesfully authenticate with code ${code}`)
            res.sendFile(__dirname + '/pages/' + findCode.page)
        }
    })


    app.get('/usecode', function (req, res) {
        res.redirect('/')
    })
    app.get('/*', function (req, res) {
        res.sendFile(__dirname + '/pages/404.html')
    })

    app.listen(config.port)
    logger.success(`Listening on port ${config.port}`)

}