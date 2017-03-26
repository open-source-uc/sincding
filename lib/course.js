const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const fs = require('fs')
const request = require('./request')
const urls = require('./urls')
const folder = require('./folder')
const file = require('./file')
const format = require('./format')

class Course {
  constructor(id, acronym, name) {
    this.id = id
    this.acronym = acronym
    this.name = name
    this.url = urls.courseURL(id)
    this.folders = {}
    this.files = {}
  }

  scrap() {
    this.folders = {}
    this.files = {}
    return new Promise((res, rej) => {
      request({url: this.url, encoding: null}, (err, http, body) => {
        if (err) {
          rej(err)
        }
        console.log(`Parsing ${this.path()}`)
        const newFolders = this.searchFoldersAndFiles(body, this)
        if (newFolders.length === 0) {
          return res(this)
        }
        Promise.all(
          newFolders.map(folder => this.scrapFolder(folder))
        ).then(() => {
          res(this)
        })
      })
    })
  }

  scrapFolder(folder) {
    return new Promise((res, rej) => {
      request({url: folder.url, encoding: null}, (err, http, body) => {
        if (err) {
          rej(err)
        }
        console.log(`Parsing ${folder.name}`)
        const newFolders = this.searchFoldersAndFiles(body, folder)
        if (newFolders.length === 0) {
          return res()
        }
        Promise.all(
          newFolders.map(folder => this.scrapFolder(folder))
        ).then(() => {
          res()
        })
      })
    })
  }

  searchFoldersAndFiles(body, parent) {
    const $ = cheerio.load(iconv.decode(body, 'ISO-8859-1'))
    const newFolders = []
    $('a').each((i, l) => {
      const link = $(l).attr('href')
      const name = $(l).text()
      if (link.indexOf('acc_carp') !== -1) {
        const linkId = link.match(/id_carpeta=\d+/g)[0].split('=')[1]
        if (this.folders[linkId]) {
          return
        }
        const newFolder = new folder(
          linkId,
          name,
          urls.courseFolderURL(link),
          parent
        )
        newFolders.push(newFolder)
        this.folders[linkId] = newFolder
      } else if (link.indexOf('id_archivo') !== -1) {
        const linkId = link.match(/id_archivo=\d+/g)[0].split('=')[1]
        if (this.files[linkId]) {
          return
        }
        const newFile = new file(
          linkId,
          name,
          urls.courseFileURL(link),
          parent
        )
        this.files[linkId] = newFile
      }
    })
    return newFolders
  }

  path(path = '') {
    const parentPath = (path !== '' && path + '/') || ''
    return parentPath + this.acronym + ' ' + format.nameCleaned(this.name)
  }

  createFolder(path) {
    try {
      fs.mkdirSync(this.path(path))
    } catch (err) {
      if (err.code === 'EEXIST') {
        return // Do nothing
      }
      error(err, 'Creating course folder')
    }
  }
}

module.exports = Course
