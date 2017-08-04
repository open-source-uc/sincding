class Format {
  static nameCleaned(name) {
    return name.replace(/[\\/:*?"><|\0]/g, "").trim()
  }
}

module.exports = Format
