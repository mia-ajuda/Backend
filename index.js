const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const setRoutes = require('./src/routes/BaseRoutes')
const dailySchedule = require('./src/utils/schedule')

const app = express()

require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())

const mongoDB = process.env.DATABASE_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => console.log('Conectado')
).catch(error => console.log(error))

dailySchedule()

setRoutes(app)
app.listen(8000)
