// import modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

// initialize express
const app = express()

// import custom project files
const config = require('./config/config') // config is the .env variables converted to easier variables.
const mongo = require('./database/mongo') // the mongoose connection to MongoDB
const routes = require('./routes/index.routes') // the routes for the API.

// sets some variables to use app wide.
app.set('secretKey', config.SECRET_KEY)
app.set('tokenExpiresIn', config.TOKEN_EXPIRESIN)

// disable the x-powered-by header.
app.disable('x-powered-by')

// middlewares
// enable morgan request logger.
app.use(morgan(config.MORGAN_LEVEL))
// enable cross-origin so anyone can use the api.
app.use(cors())
// parse incoming requests body
app.use(bodyParser.json())

// send all request to routes handler.
app.use('/', routes)

// error handle
app.use((error, req, res, next) => {
  console.log(error)

  res.status(error.status || 500).json({
    errors: {
      status: error.status || 500,
      name: error.name || 'Unknown error',
      message: error.message || 'Internal server error'
    }
  })
})

// start express, print out app title, startup message and listen on the port set in .env file
app.listen(config.PORT, () => {
  console.log(config.APP_NAME)
  console.log(config.STARTUP_MESSAGE)
  console.log(`${config.APP_NAME} is running on port: ${config.PORT}`)
  console.log(`Running in ${process.env.NODE_ENV} mode.`)
  // Initialize database connection.
  mongo()
})
