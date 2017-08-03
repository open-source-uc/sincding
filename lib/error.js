const pkg = require("../package.json")

const error = (msg, context) => {
  const error = `
--- ${pkg.version} ERROR ${context}
      ${msg}

  If necessary, please report this problem here
    https://github.com/open-source-uc/sincding/issues
-----
  `
  console.log(error)
}

module.exports = error
