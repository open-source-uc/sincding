const request = require('./request');
const cheerio = require('cheerio');
const urls = require('./urls');
const course = require('./course');

class Course {
  constructor(id, acronym, name) {
    this.id = id;
    this.acronym = acronym;
    this.name = name;
    this.url = urls.courseURL(id);
  }

  sync(path) {
    return new Promise((res, rej) => {
      request(this.url, (err, http, body) => {
        console.log(`Parsing ${this.name} files`);
        const folders = [];
        const $ = cheerio.load(body);
        $('a').each((i, l) => {
          const link = $(l).attr('href');
          if (link.indexOf('acc_carp') === -1) {
            return;
          }
          console.log(`${this.name} link`);
          console.log(`${link}`);
        });
        res();
      });
    });
  }
}

module.exports = Course;
