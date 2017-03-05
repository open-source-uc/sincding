const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const request = require('./request');
const urls = require('./urls');
const course = require('./course');

class Siding {
  static coursesList(session, ignore = []) {
    return session.login().then(() => {
      console.log('Getting courses list');
      return new Promise((res, rej) => {
        request({url: urls.coursesURL, encoding: null}, (err, http, body) => {
          if (err) {
            rej(err);
          }
          console.log('Parsing courses list');
          const courses = [];
          const $ = cheerio.load(iconv.decode(body, 'ISO-8859-1'));
          $('a').each((i, l) => {
            const link = $(l).attr('href');
            if (link.indexOf('id_curso_ic') === -1) {
              return;
            }
            const courseId = link.split('id_curso_ic=')[1];
            const courseSplit = $(l).text().split(/ s\.[0-9] /);
            const courseAcronym = courseSplit[0];
            if (ignore.indexOf(courseAcronym) !== -1) {
              return;
            }
            const courseName = courseSplit[1];
            courses.push(new course(courseId, courseAcronym, courseName));
          });
          res(courses);
        });
      });
    });
  }
}

module.exports = Siding;
