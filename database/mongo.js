const mongoose = require('mongoose')
const config = require('../config/config')

mongoose.Promise = global.Promise

let connectedBefore = false

function connect () {
  return mongoose.connect(config.MONGODB_URI,
    {
      useNewUrlParser: true,
      autoReconnect: true,
      reconnectInterval: config.DB_RECONNECT_SECONDS * 1000,
      reconnectTries: Number.MAX_VALUE
    })
    .catch((error) => {
      console.log('Mongoose could not connect to MongoDB.')
      console.log('Retry to connect every 5 seconds.')
      console.log(error.message)
    })
}

function init () {
  connect()

  mongoose.connection.on('connecting', () => {
    console.log('Mongoose is connecting to MongoDB')
  })

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose is connected to MongoDB`)
    connectedBefore = true
  })

  mongoose.connection.on('error', error => {
    if (connectedBefore) {
      console.log('Error in Mongoose connection to MongoDB.')
      console.log(error.message)
    }
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected from MongoDB.')
    if (!connectedBefore) {
      setTimeout(connect, config.DB_RECONNECT_SECONDS * 1000)
    } else {
      console.log('Retry to connect every 5 seconds.')
    }
  })

  mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to MongoDB.')
  })
}

module.exports = init
