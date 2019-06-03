const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const config = require('./app/config/config')
require('./app/config/database')
const routes = require('./app/routes/routes')

app.set('secretKey', config.SECRET_KEY)
app.use(cors())
app.use(morgan(config.MORGAN))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', routes)

app.listen(config.HOST_PORT, () => {
  console.log('Server is running on: http://' + config.HOST_URL + ':' + config.HOST_PORT)
})
