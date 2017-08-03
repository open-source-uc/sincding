const wait = () => {
  const seconds = 0.1
  const waitTill = new Date(new Date().getTime() + seconds * 1000)
  while (waitTill > new Date()) {
    // Do nothing
  }
}

module.exports = wait
