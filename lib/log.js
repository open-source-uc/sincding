const log = msg => {
  const test = process.env.TEST
  const dev = process.env.NODE_ENV == "development"
  const prod = process.env.NODE_ENV == "production"

  if (test) {
    return
  }

  if (dev || prod) {
    console.log(msg)
  }
}

module.exports = log
