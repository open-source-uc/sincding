const error = (msg, context) => {
  const error = `
--- ERROR ${context}
      ${msg}

  Please report this problem here
    https://github.com/open-source-uc/sincding/issues
-----
  `
  console.log(error)
}

module.exports = error
