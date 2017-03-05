const fs = require('fs');
const request = require('./request');

class File {
  constructor(id, name, url, parent) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.parent = parent;
    // console.log('File');
    // console.log(this.path());
  }

  path(path) {
    return this.parent.path(path) + '/' + this.name;
  }

  shouldDownload(path) {
    if (fs.existsSync(path + '/' + this.path())) {
      return false;
    }
    return true;
  }

  download(path) {
    return new Promise((res, rej) => {
      request(this.url)
        .on('response', response => {
          console.log('Downloaded file');
          console.log(this.parent.name + '/' + this.name);
          res();
        })
        .pipe(fs.createWriteStream(this.path(path)));
    });
  }
}

module.exports = File;
