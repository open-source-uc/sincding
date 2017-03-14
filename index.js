#!/usr/bin/env node

const prompt = require('prompt');
const fs = require('fs');
const os = require('os');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const Session = require('./session');
const siding = require('./siding');

prompt.colors = false;

const userDataFolder = `${os.homedir()}/.sincding`;

data = () => {
  console.log("Let' update ur data");
  const schema = {
    properties: {
      username: {
        pattern: /^[a-zA-Z\d]+$/,
        message: 'Username without @uc',
        required: true,
      },
      password: {
        required: true,
        hidden: true,
        replace: '*',
      },
      path: {
        required: true,
      },
      ignore: {},
    },
  };
  prompt.start();
  const saveData = (err, result) => {
    const data = Object.assign({}, result, {ignore: result.ignore.split(' ')});
    if (!fs.existsSync(`${userDataFolder}`)) {
      fs.mkdirSync(`${userDataFolder}`);
    }
    fs.writeFile(
      `${userDataFolder}/data.json`,
      JSON.stringify(data),
      'utf8',
      run,
    );
  };
  prompt.get(schema, saveData);
};

sync = data => {
  const session = new Session(data.username, data.password);
  siding.coursesList(session, data.ignore).then(courses => {
    console.log('Found courses');
    console.log(courses.map(c => c.path()));
    Promise.all(courses.map(course => course.scrap()))
      .then(courses => {
        console.log('Found:');
        const found = courses.map(c => ({
          name: c.name,
          folders: Object.keys(c.folders).length,
          files: Object.keys(c.files).length,
        }));
        console.log(found);
        console.log('Download:');
        const downloads = courses.map(c => ({
          name: c.name,
          folders: Object.keys(c.folders)
            .filter(id => c.folders[id].shouldCreate(data.path))
            .map(id => c.folders[id]),
          files: Object.keys(c.files)
            .filter(id => c.files[id].shouldDownload(data.path))
            .map(id => c.files[id]),
        }));
        const downloadNumbers = downloads.map(download => ({
          name: download.name,
          folders: download.folders.length,
          files: download.files.length,
        }));
        console.log(downloadNumbers);
        console.log('Creating missing folders...');
        courses.forEach(course => course.createFolder(data.path));
        downloads.forEach(d => d.folders.forEach(f => f.create(data.path)));
        console.log('Starting downloads, this may take a while...');
        const files = downloads
          .map(download => download.files)
          .reduce((total, arr) => total.concat(arr));
        Promise.all(files.map(file => file.download(data.path))).then(() =>
          console.log('Finished downloading!'));
      })
      .catch(err => console.log(`Had an error\n${error}`));
  });
};

options = {
  data: data,
  sync: sync,
  exit: () => {},
};

optionsDescriptions = {
  data: 'Update your data',
  sync: 'Download everythang',
  exit: 'Exit',
};

run = () => {
  let userData = null;
  try {
    userData = require(`${userDataFolder}/data.json`);
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
  console.log(`ignore: ${userData.ignore}`);
  console.log('Options');
  Object.keys(options).forEach(key => {
    console.log(`${key}: ${optionsDescriptions[key]}`);
  });
  const commandLine = options[process.argv[2]];
  if (commandLine) {
    process.argv[2] = '';
    return commandLine(userData);
  }
  prompt.start();
  runCommand = (err, result) => {
    const command = options[result.command];
    if (!command) {
      console.log('Not a valid command');
      return run();
    }
    options[result.command](userData);
  };
  prompt.get(['command'], runCommand);
};

updateNotifier({pkg}).notify();
console.log('Welcome to sincding!');
run();
