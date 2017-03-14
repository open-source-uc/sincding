const request = require('./request');
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
    return new Promise((res, rej) =>
      request.post({url: urls.loginURL, form: body}, (err, http, body) => {
        console.log('Checking login');
        // Check login succedded
        // rej() if not
        res();
      }));
  }

  sync(path) {
    // console.log('sync');
    // console.log(path);
  }
}

module.exports = Session;
