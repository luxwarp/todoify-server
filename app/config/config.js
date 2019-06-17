const envFile = require('dotenv').config()

if (envFile.error) {
  throw new Error('Problem reading .env file.')
} else {
  const config = {
    APP_TITLE: process.env.APP_TITLE || 'Todoify Server',
    STARTUP_MESSAGE: process.env.STARTUP_MESSAGE || 'Starting Todoify Server...',
    HOST_URL: process.env.HOST_URL || 'localhost',
    HOST_PORT: process.env.HOST_PORT || '5050',
    MORGAN: process.env.MORGAN || 'common',
    SECRET_KEY: process.env.SECRET_KEY || 'Iam-Super_secret-dont-!hack-Me',
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DBNAME: process.env.DB_DBNAME,
    DB_RECONNECT_SECONDS: process.env.DB_RECONNECT_SECONDS || 5
  }

  module.exports = config
}
