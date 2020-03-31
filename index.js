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

const userExample2 = new user({
    name: 'Ivan-sama',
    birthday: '1999-02-ss10',
    cpf: '123456789',
    photo: 'profilePhoto',
    address: {
        cep: '72440512',
        number: 45,
        city: 'Brasília (sudoeste)',
        state: 'DF',
        complement: 'Ap 304'
    },
    location: {
        latitude: 12.12121,
        longitude: 84.94128
    },
    phone: '+55619912937179'
})

var userExample = new user({
    name: 'Weli-sama',
    birthday: '1998-12-06',
    cpf: '02376937124',
    photo: 'profilePhoto',
    address: {
        cep: '72440503',
        number: 33,
        city: 'Gama (setor leste)',
        state: 'DF',
        complement: 'Casa'
    },
    location: {
        latitude: 12.12121,
        longitude: 84.94128
    },
    phone: '+5561999937179'
})

const categoryExample = new category({
    name: 'Higiene Básica',
    description: 'Objetos de higiene básica, como sabonete'
})

var helpExample = new help({
    title: 'Hospital da Criança - Necessidade de Álcool Gel',
    description: 'O hospital da criança vem enfrentando grandes dificuldades...',
    status: 'em andamento',
    possibleHelpers: [userExample2._id],
    categoryId: categoryExample._id,
    ownerId: userExample._id,
    helperId: userExample2._id,
    finishedDate: '2020-03-31'
})

// userExample.save(function (err, product) {
//     if (err) {
//         console.log(err)
//     }
//     console.log(product)
// })

// categoryExample.save(function (err, product) {
//     if (err) {
//         console.log(err)
//     }
//     console.log(product)
// })

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
