var request = require('request');
var request = request.defaults({jar: true});
const jar = request.jar();
// var request = request.defaults({jar: true});
const urls = require('./urls');

class Session {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  login() {
    const body = {
      login: this.username,
      passwd: this.password,
      sw: '',
      sh: '',
      cd: '',
    };
    console.log('Starting login');
    request.post({url: urls.loginURL, form: body}, this.loginResponse);
  }

  loginResponse(err, httpResponse, body) {
    // Here we should check the body to see if login succedded
    request.get(urls.coursesPath, (e, h, b) => console.log(b));
  }

  sync(path) {
    // console.log('sync');
    // console.log(path);
  }
}

module.exports = Session;
