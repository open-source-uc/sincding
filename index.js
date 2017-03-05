const prompt = require('prompt');
const fs = require('fs');
const Session = require('./session');
const courses = require('./courses');

data = () => {
  console.log("Let' update ur data");
  prompt.start();
  const saveData = (err, result) =>
    fs.writeFile('./data.json', JSON.stringify(result), 'utf8', run);
  prompt.get(['username', 'password', 'path'], saveData);
};

sync = () => {
  const data = readData();
  const session = new Session(data.username, data.password);
  courses.coursesList(session).then(console.log);
};

options = {
  data: data,
  sync: sync,
};

optionsDescriptions = {
  data: 'Update your data',
  sync: 'Download everythang',
};

run = () => {
  let userData = null;
  try {
    userData = require('./data.json');
  } catch (err) {
    data();
    return;
  }
  if (!userData) {
    data();
  }
  console.log('Ur data');
  console.log(`user: ${userData.username}`);
  console.log(`path: ${userData.path}`);
  console.log('Options');
  Object.keys(options).forEach(key => {
    console.log(`${key}: ${optionsDescriptions[key]}`);
  });
  prompt.start();
  runCommand = (err, result) => options[result.command](userData);
  prompt.get(['command'], runCommand);
};

console.log('Welcome to sincding!');
run();
