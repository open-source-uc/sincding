const wait = () => {
  const seconds = 0.18
  const waitTill = new Date(new Date().getTime() + seconds * 1000)
  while (waitTill > new Date()) {}
}

module.exports = wait
