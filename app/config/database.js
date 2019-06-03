const mongoose = require('mongoose')
const config = require('./config')

const mongoDB = 'mongodb://' +
                config.DB_USERNAME + ':' +
                config.DB_PASSWORD + '@' +
                config.DB_HOST + ':' +
                config.DB_PORT + '/' +
                config.DB_DBNAME

let connected = false
mongoose.connect(mongoDB, { useNewUrlParser: true })

function retryConnection () {
  if (connected === false) {
    console.log('Failed to connect to database. Trying again in 5 seconds')
    setTimeout(() => {
      mongoose.connect(mongoDB, { useNewUrlParser: true })
    }, 5000)
  }
}

mongoose.connection.on('error', (error) => {
  if (error.name === 'MongoNetworkError') {
    retryConnection()
  } else {
    console.error(error)
  }
})

mongoose.connection.on('connected', () => {
  console.log('Connected to database.')
  connected = true
})

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from database')
  connected = false
})

mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to database')
  connected = true
})

mongoose.connection.on('reconnectFailed', () => {
  retryConnection()
})

module.exports = mongoose
