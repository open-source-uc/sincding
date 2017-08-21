const log = (msg, options = {}) => {
  const test = process.env.NODE_ENV === "test"
  if (test) {
    return
  }

  if (options.partial) {
    process.stdout.write(msg)
  } else if (options.replace) {
    process.stdout.write(`${msg}\r`)
  } else {
    console.log(msg)
  }
}

log.ok = () => log("ok!")

module.exports = log
