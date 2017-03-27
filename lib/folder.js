const fs = require('fs')
const format = require('./format')
const error = require('./error')

class Folder {
  constructor(id, name, url, parent) {
    this.id = id
    this.name = name
    this.url = url
    this.parent = parent
  }

  path(path) {
    return this.parent.path(path) + '/' + format.nameCleaned(this.name)
  }

  shouldCreate(path) {
    if (fs.existsSync(this.path(path))) {
      return false
    }
    return true
  }

  create(path) {
    try {
      console.log(`${this.parentAcronym()} Creating folder`)
      console.log(this.parent.name.trim() + '/' + this.name)
      fs.mkdirSync(this.path(path))
    } catch (err) {
      error(err, 'Creating folder')
    }
  }

  parentAcronym() {
    if (!this.parent.acronym) {
      return this.parent.parentAcronym()
    }
    return this.parent.acronym
  }
}

module.exports = Folder
