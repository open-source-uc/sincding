const request = require('./request');
const cheerio = require('cheerio');
const urls = require('./urls');
const course = require('./course');

class Siding {
  static coursesList(session) {
    return session.login().then(() => {
      console.log('Getting courses list');
      return new Promise((res, rej) => {
        request(urls.coursesURL, (err, http, body) => {
          console.log('Parsing courses list');
          const courses = [];
          const $ = cheerio.load(body);
          $('a').each((i, l) => {
            const link = $(l).attr('href');
            if (link.indexOf('id_curso_ic') === -1) {
              return;
            }
            const courseId = link.split('id_curso_ic=')[1];
            const courseSplit = $(l).text().split(/ s\.[0-9] /);
            const courseAcronym = courseSplit[0];
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
