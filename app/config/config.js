const envFile = require('dotenv').config()

if (envFile.error) {
  throw new Error('Problem reading .env file.')
} else {
  const config = {
    HOST_URL: process.env.HOST_URL,
    HOST_PORT: process.env.HOST_PORT,
    MORGAN: process.env.MORGAN,
    SECRET_KEY: process.env.SECRET_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DBNAME: process.env.DB_DBNAME
  }

  module.exports = config
}
