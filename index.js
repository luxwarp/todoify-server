// import modules
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

// initialize express
const app = express()

// import custom project files
const config = require('./app/config/config') // config is the .env variables converted to easier variables.
require('./app/config/database') // the mongoose connection to MongoDB
const routes = require('./app/routes/routes') // the routes for the API.

app.set('secretKey', config.SECRET_KEY) // set our secret key so we can use it in express if we want to.
app.use(cors()) // enable cross-origin so anyone can use the api.
app.use(morgan(config.MORGAN)) // activate morgan logger for logging to console.
// parse incoming requests body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', routes) // send all request to routes handler.

// start express, print out app title, startup message and listen on the port set in .env file
app.listen(config.HOST_PORT, () => {
  console.log('# ' + config.APP_TITLE)
  console.log(config.STARTUP_MESSAGE)
  console.log('Server is running on: http://' + config.HOST_URL + ':' + config.HOST_PORT)
})
