const cheerio = require('cheerio')
const fs = require('fs')
const axios = require('axios')
const urls = require('./urls')
const folder = require('./folder')
const file = require('./file')
const format = require('./format')
const error = require('./error')

class Course {
  constructor(id, acronym, name) {
    this.id = id
    this.acronym = acronym
    this.name = name
    this.url = urls.courseURL(id)
    this.folders = {}
    this.files = {}
  }

  async scrap() {
    this.folders = {}
    this.files = {}
    await this.scrapFolder(this)
  }

  async scrapFolder(folder) {
    try {
      const html = (await axios.get(folder.url)).data
      console.log(`Parsing ${folder.name}`)
      const newFolders = this.searchFoldersAndFiles(html, folder)
      await newFolders.reduce(async (promise, folder) => {
        await promise
        const seconds = 0.15
        const waitTill = new Date(new Date().getTime() + seconds * 1000)
        while (waitTill > new Date()) {}
        return this.scrapFolder(folder)
      }, Promise.resolve())
    } catch (err) {
      const message = `\n
       name: ${folder.name}
       url: ${folder.url}`
      error(err.message + message, 'scrapFolder')
    }
  }

  searchFoldersAndFiles(html, parent) {
    const $ = cheerio.load(html)
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
        const newFile = new file(linkId, name, urls.courseFileURL(link), parent)
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
