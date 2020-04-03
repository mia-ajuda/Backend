require('dotenv').config()

const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')

const app = express()

const setRoutes = require('./src/routes/BaseRoutes')
const databaseConnect = require('./src/config/database')
const dailySchedule = require('./src/utils/schedule')

app.use(cors())
app.use(bodyParser.json())

databaseConnect()
setRoutes(app)
dailySchedule()

app.listen(8000)
