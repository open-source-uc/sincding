const fs = require('fs');

class Folder {
  constructor(id, name, url, parent) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.parent = parent;
  }

  path() {
    return this.parent.path() + '/' + this.name;
  }

  fullPath(path) {
    return path + '/' + this.path();
  }

  shouldCreate(path) {
    if (fs.existsSync(this.fullPath(path))) {
      return false;
    }
    return true;
  }

  download(path) {
    try {
      fs.mkdirSync(this.fullPath(path));
    } catch (err) {}
  }
}

module.exports = Folder;
