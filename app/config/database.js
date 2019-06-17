const mongoose = require('mongoose')
const config = require('./config')

// create url to MongoDB
const mongoDB = 'mongodb://' +
                config.DB_USERNAME + ':' +
                config.DB_PASSWORD + '@' +
                config.DB_HOST + ':' +
                config.DB_PORT + '/' +
                config.DB_DBNAME

// this is true or false if mongoose is connected to MongoDB
let connected = false
// Mongoose connecting to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true })

// If mongoose is unable to connect to MongoDB or loses connection this will run every x seconds set in .env.
function retryConnection () {
  if (connected === false) {
    console.log('Failed to connect to database. Trying again in ' + config.DB_RECONNECT_SECONDS + ' seconds')
    setTimeout(() => {
      mongoose.connect(mongoDB, { useNewUrlParser: true })
    }, config.DB_RECONNECT_SECONDS * 1000)
  }
}

// handle different events for mongoose connection to MongoDB
mongoose.connection.on('error', (error) => {
  if (error.name === 'MongoNetworkError') {
    retryConnection()
  } else {
    console.error(error)
  }
})

// connected to MongoDB
mongoose.connection.on('connected', () => {
  console.log('Connected to database.')
  connected = true
})

// disconnected to MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from database')
  connected = false
})

// Reconnected to MongoDB by it self without retryConnection function.
mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to database')
  connected = true
})

// if mongoose is unable to reconnect by it self run retryConnection function until it connects.
mongoose.connection.on('reconnectFailed', () => {
  retryConnection()
})

module.exports = mongoose
