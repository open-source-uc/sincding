const fs = require("fs")
const axios = require("axios")
const format = require("./format")
const error = require("./error")
const wait = require("./wait")

class File {
  constructor(id, name, url, parent) {
    this.id = id
    this.name = name
    this.url = url
    this.parent = parent
  }

  path(path) {
    return this.parent.path(path) + "/" + format.nameCleaned(this.name)
  }

  shouldDownload(path) {
    if (fs.existsSync(path + "/" + this.path())) {
      return false
    }
    return true
  }

  async download(path, i, n, repeat = 0) {
    let data
    try {
      data = (await axios.get(this.url, {
        transformResponse: data => data,
      })).data
      console.log(
        `r:${repeat} ${i}/${n} ${this.parentAcronym()} ${this.parent.name.trim()}/${this
          .name}`
      )
      fs.writeFile(this.path(path), data, { encoding: null }, err => {
        if (err) {
          const message = `\n
            name: ${this.name}
            path: ${this.path(path)}
            ur: ${this.url}
          `
          error(err.message + message, "download")
        }
      })
    } catch (err) {
      if (err.response.status === 500 && repeat < 5) {
        for (let i = 0; i < repeat; i++) {
          wait()
        }
        return this.download(path, i, n, repeat + 1)
      }
      const message = `\n
       name: ${this.name}
       url: ${this.url}
       repeat: ${repeat}`
      error(err.message + message, "file download")
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
