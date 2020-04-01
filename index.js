const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const setRoutes = require('./src/routes/BaseRoutes')

const app = express()

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

const mongoDB = process.env.DATABASE_URL
console.log(mongoDB)
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => console.log('Conectado')
).catch(error => console.log(error))


setRoutes(app)
app.listen(8000)
