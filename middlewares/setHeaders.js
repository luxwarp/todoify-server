
module.exports = (config) => {
  return (req, res, next) => {
    res.set({
      Server: config.APP_NAME
    })

    next()
  }
}
