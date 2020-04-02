require('dotenv').config()

const bodyParser = require('body-parser');
const cors = require('cors')
const express = require('express')
const setRoutes = require('./src/routes/BaseRoutes')
const dailySchedule = require('./src/utils/schedule')

const app = express()

const setRoutes = require('./src/routes/BaseRoutes')
const databaseConnect = require('./src/config/database')

app.use(cors())
app.use(bodyParser.json())

databaseConnect()
dailySchedule()
setRoutes(app)

app.listen(8000)
