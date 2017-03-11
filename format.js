class Format {
  static nameCleaned(name) {
    return name.replace(/[\\/:*?"><|\0]/g, '');
  }
}

module.exports = Format;