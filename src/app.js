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
} else if (!config.create_code) {
    logger.failed('You have to set code to create codes.')
} else if (!config.del_code) {
    logger.failed('You have to set code to delete codes.')
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

    app.use(express.static(path.join(__dirname, 'pages/css')));

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/pages/index.html')
    })

    app.post('/usecode', async function (req, res) {
        const code = req.body.code
        const findCode = await codeModel.findOne({ code: code})
        if  (code === config.create_code) {
            res.sendFile(__dirname + '/pages/createcode.html')
        } else if  (code === config.del_code) {
            res.sendFile(__dirname + '/pages/delcode.html')
        } else if (!findCode){
            logger.auth(`User failed authentication with code ${code}`)
            res.sendFile(__dirname + '/pages/wrongcode.html')
        } else {
            logger.auth(`User succesfully authenticate with code ${code}`)
            res.sendFile(__dirname + '/pages/' + findCode.page)
        }
    })

    app.post('/createcode', async function (req, res) {
        const code = req.body.code
        const page = req.body.page
        const findCode = await codeModel.findOne({ code: code})
        if (!findCode) {
            const newcode = new codeModel({
                code: code,
                page: page
            })
            await newcode.save()
            const html = `<!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="./css/style.css">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
                    <title>Wrong code</title>
                    <style>
                        body {
                background: rgb(63,94,251);
                
            }
            
            .title {
                font-family: 'Oswald', sans-serif;
                color: whitesmoke;
                padding-top: 23%;
                text-align: center;
            }
            
            input[type=text] {
                border: 2px solid whitesmoke;
                border-radius: 4px;
                height: 25px;
                width: 250px;
            }
            
            div.form
            {
                display: block;
                text-align: center;
            }
            
            input[type=submit] {
                display: block;
                margin-top: 10px;
                margin-left: auto;
                margin-right: auto;
                border: 2px solid whitesmoke;
                border-radius: 12px;
                padding: 12px 36px;
                font-size: 18px;
                font-family: 'Oswald', sans-serif;
                cursor: pointer;
                background-color: whitesmoke;
                transition-duration: 0.4s;
            }
            
            input[type=submit]:hover {
                background-color: rgb(45, 204, 31);
                border: 2px solid rgb(45, 204, 31);
            }
                    </style>
                </head>
                <body>
                    <h1 class="title">Code has been created!</h1>
                    <form action="/" method="get">
                        <input type="submit" value="Go Back">
                    </form>
                </body>
            </html>`
            res.send(html)
            logger.success(`Code ${code} has been created!`)
        } else {
            logger.failed(`Code ${code} failed to create (Already exist)!`)
            res.send('This code already exist!')
        }
    })

    app.post('/delcode', async function (req, res) {
        const code = req.body.code
        const findCode = await codeModel.findOne({ code: code})
        if (!findCode) {
            res.send('Code not found!')
            logger.failed(`Code ${code} failed to delete!`)
        } else {
            const delCode = await codeModel.findOneAndDelete({ code: code})
            const html = `<!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="./css/style.css">
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
                    <title>Wrong code</title>
                    <style>
                        body {
                background: rgb(63,94,251);
                
            }
            
            .title {
                font-family: 'Oswald', sans-serif;
                color: whitesmoke;
                padding-top: 23%;
                text-align: center;
            }
            
            input[type=text] {
                border: 2px solid whitesmoke;
                border-radius: 4px;
                height: 25px;
                width: 250px;
            }
            
            div.form
            {
                display: block;
                text-align: center;
            }
            
            input[type=submit] {
                display: block;
                margin-top: 10px;
                margin-left: auto;
                margin-right: auto;
                border: 2px solid whitesmoke;
                border-radius: 12px;
                padding: 12px 36px;
                font-size: 18px;
                font-family: 'Oswald', sans-serif;
                cursor: pointer;
                background-color: whitesmoke;
                transition-duration: 0.4s;
            }
            
            input[type=submit]:hover {
                background-color: rgb(45, 204, 31);
                border: 2px solid rgb(45, 204, 31);
            }
                    </style>
                </head>
                <body>
                    <h1 class="title">Code has been deleted!</h1>
                    <form action="/" method="get">
                        <input type="submit" value="Go Back">
                    </form>
                </body>
            </html>`
            res.send(html)
            logger.success(`Code ${code} has been deleted!`)
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