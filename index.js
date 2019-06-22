// import modules
const express = require('express')
const cors = require('cors')

// initialize express
const app = express()

// import custom project files
const config = require('./app/config/config') // config is the .env variables converted to easier variables.
require('./app/config/database') // the mongoose connection to MongoDB
const routes = require('./app/routes/index.routes') // the routes for the API.

app.set('secretKey', config.SECRET_KEY) // sets our secret key so we can use it in express if we want to, like for JWT sign.
app.set('tokenExpiresIn', config.TOKEN_EXPIRESIN)
app.disable('x-powered-by')
app.use(cors()) // enable cross-origin so anyone can use the api.

// parse incoming requests body
app.use(express.json())

// send all request to routes handler.
app.use('/', routes)

// error handle
app.use((error, req, res, next) => {
  // console.log the error if no clientMessage exist, then it's not a custom error.
  if (!error.clientMessage) {
    console.log(error)
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    clientMessage: error.clientMessage || 'Server error'
  })
})

// start express, print out app title, startup message and listen on the port set in .env file
app.listen(config.PORT, () => {
  console.log(config.APP_NAME)
  console.log(config.STARTUP_MESSAGE)
  console.log(`${config.APP_NAME} is running on port: ${config.PORT}`)
})
