error = (err, context = '') => {
  const errorMessage = `
--- Had an error --- ${context}
    ${err}

--- Please report it to https://github.com/open-source-uc/sincding/issues\n
`
  console.log(errorMessage)
}

module.exports = error
