require('dotenv').config()

const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const setRoutes = require('./src/routes/BaseRoutes')
const dailySchedule = require('./src/utils/schedule')

const app = express()

const databaseConnect = require('./src/config/database')
const dailySchedule = require('./src/utils/schedule')

app.use(cors())
app.use(bodyParser.json())

databaseConnect()
dailySchedule()
setRoutes(app)
dailySchedule()

app.listen(8000)
