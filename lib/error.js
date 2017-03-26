error = (err, context = '') => {
  const errorMessage = `
    --- Had an error --- ${context}
    ${error}

    --- Please report it to https://github.com/open-source-uc/sincding/issues
  `
  console.log(errorMessage)
}

module.exports = error
