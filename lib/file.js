const fs = require('fs')
const axios = require('axios')
const format = require('./format')
const error = require('./error')
const wait = require('./wait')

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

  async download(path, repeat = 0) {
    try {
      const data = (await axios.get(this.url, {
        transformResponse: data => data,
      })).data
      console.log(`${this.parentAcronym()} Downloaded file`)
      console.log(this.parent.name.trim() + '/' + this.name)
      fs.writeFile(this.path(path), data, { encoding: null }, this.writeFile)
    } catch (err) {
      if (err.response.status === 500 && repeat < 5) {
        wait()
        return this.download(path, repeat + 1)
      }
      const message = `\n
       name: ${this.name}
       url: ${this.url}
       path: ${this.path(path)}
       repeat: ${repeat}`
      error(err.message + message, 'download')
    }
  }

  writeFile(err) {
    if (err) {
      const message = `\n
      name: ${this.name}
      path: ${this.path(path)}
      ur: ${this.url}
    `
      error(err.message + message, 'download')
    }
  }

  parentAcronym() {
    if (!this.parent.acronym) {
      return this.parent.parentAcronym()
    }
    return this.parent.acronym
  }
}

module.exports = File
