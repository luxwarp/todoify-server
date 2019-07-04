const envFile = require('dotenv').config()

if (envFile.error) {
  throw new Error('Problem reading .env file.')
} else {
  const config = {
    APP_NAME: process.env.APP_TITLE || 'Todoify Server',
    PROCESS_NAME: process.env.PROCESS_NAME || 'todoify-server',
    STARTUP_MESSAGE: process.env.STARTUP_MESSAGE || 'Starting Todoify Server...',
    PORT: process.env.HOST_PORT || '5050',
    SECRET_KEY: process.env.SECRET_KEY || 'Iam-Super_secret-dont-!hack-Me',
    TOKEN_EXPIRESIN: process.env.TOKEN_EXPIRESIN || '1h',
    MORGAN_LEVEL: process.env.MORGAN_LEVEL || 'dev',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://username:password@localhost:27017/todoify',
    DB_RECONNECT_SECONDS: process.env.DB_RECONNECT_SECONDS || 5
  }

  module.exports = config
}
