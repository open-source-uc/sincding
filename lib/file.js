const fs = require('fs')
const axios = require('axios')
const format = require('./format')
const error = require('./error')

class File {
  constructor(id, name, url, parent) {
    this.id = id
    this.name = name
    this.url = url
    this.parent = parent
  }

  path(path) {
    return this.parent.path(path) + '/' + format.nameCleaned(this.name)
  }

  shouldDownload(path) {
    if (fs.existsSync(path + '/' + this.path())) {
      return false
    }
    return true
  }

  async download(path) {
    const data = (await axios.get(this.url, {
      transformResponse: data => data,
    })).data
    console.log(`${this.parentAcronym()} Downloaded file`)
    console.log(this.parent.name.trim() + '/' + this.name)
    fs.writeFile(this.path(path), data, { encoding: null }, err => {
      if (err) {
        const message = `\n
          name: ${this.name}
          path: ${this.path(path)}
        `
        error(err.message + message, 'download')
      }
    })
  }

  parentAcronym() {
    if (!this.parent.acronym) {
      return this.parent.parentAcronym()
    }
    return this.parent.acronym
  }
}

module.exports = File
