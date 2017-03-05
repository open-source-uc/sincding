const prompt = require('prompt');
const fs = require('fs');
const Session = require('./session');
const siding = require('./siding');

data = () => {
  console.log("Let' update ur data");
  prompt.start();
  const saveData = (err, result) => {
    const data = Object.assign({}, result, {ignore: result.ignore.split(' ')});
    fs.writeFile('./data.json', JSON.stringify(data), 'utf8', run);
  };
  prompt.get(['username', 'password', 'path', 'ignore'], saveData);
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
        // downloads.forEach(
        //   download => download.folders.forEach(folder => folder.create())
        // );
        // console.log('Starting downloads, this may take a while...');
      })
      .catch(err => console.log(`Had an error\n${error}`));
  });
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
  const commandLine = options[process.argv[2]];
  if (commandLine) {
    return commandLine(userData);
  }
  prompt.start();
  runCommand = (err, result) => options[result.command](userData);
  prompt.get(['command'], runCommand);
};

console.log('Welcome to sincding!');
run();
