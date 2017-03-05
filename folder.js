class Folder {
  constructor(id, name, url, parent) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.parent = parent;
    // console.log('Folder');
    // console.log(this);
  }

  path() {
    return this.parent.path() + '/' + this.name;
  }
}

module.exports = Folder;
