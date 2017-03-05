const fs = require('fs');

class File {
  constructor(id, name, url, parent) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.parent = parent;
    // console.log('File');
    // console.log(this.path());
  }

  path() {
    return this.parent.path() + '/' + this.name;
  }

  shouldDownload(path) {
    if (fs.existsSync(path + '/' + this.path())) {
      return false;
    }
    return true;
  }
}

module.exports = File;
