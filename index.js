const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const user = require('./src/models/user')
const help = require('./src/models/help')
const category = require('./src/models/category')

const app = express()

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

const mongoDB = process.env.DATABASE_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    ()=> console.log('Conectado')
).catch(error => console.log(error))


app.post('/user', (req, res) => {
    const userDB = new user(req.body)
    userDB.save(function (err, user) {
        if (err) {
            res.send(err)
        }
        res.send(user._id)
    })
})

app.get('/user/:id', (req, res) => {
    console.log(req.params.id)

    user.findById(req.params.id).then(response => {
        console.log(response)
        res.send(response)
    }).catch(error => console.log(error))
})

app.listen(8000)
