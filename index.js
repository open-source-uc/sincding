const prompt = require('prompt');
const Session = require('./session');
const courses = require('./courses');

sync = () => {
  const data = require('./data.json');
  const session = new Session(data.username, data.password);
  courses.coursesList(session).then(console.log);
};

options = {
  sync: sync,
};

optionsDescriptions = {
  sync: 'Download everythang',
};

run = () => {
  // console.log('Options');
  // Object.keys(options).forEach(key => {
  //   console.log(`${key}: ${optionsDescriptions[key]}`);
  // });
  // prompt.start();
  // prompt.get(['command'], runCommand);
  sync();
};

runCommand = (err, result) => options[result.command]();

// console.log('Welcome to sincding!');
run();
