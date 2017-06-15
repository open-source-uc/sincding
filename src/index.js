#!/usr/bin/env node

const prompt = require('prompt')
const fs = require('fs')
const os = require('os')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const Session = require('../lib/session')
const siding = require('../lib/siding')
const error = require('../lib/error')
const log = require('./log')

prompt.colors = false

const userDataFolder = `${os.homedir()}/.sincding`

data = (data = {}) => {
  console.log('Let\'s update your user data')
  if (data.username) {
    console.log(
      ' For each prompt the value in () is the current one\n Press enter if you don\'t want to change it'
    )
  }
  const schema = {
    properties: {
      username: {
        pattern: /^[a-zA-Z\d]+$/,
        message: 'Username without @uc',
        required: true,
        default: data.username || '',
      },
      password: {
        required: true,
        hidden: true,
        replace: '*',
      },
      path: {
        required: true,
        default: data.path || '',
        conform: path => {
          if (!fs.existsSync(path)) {
            console.log('The provided path doesn\'t exist')
            return false
          }
          return true
        },
      },
      ignore: {
        pattern: /^[a-zA-Z\d ]+$/,
        message: 'Course acronyms separated by a space',
        default: (data.ignore || []).join(' '),
      },
    },
  }
  prompt.start()
  const saveData = (err, result) => {
    if (!result) {
      return exit()
    }
    const data = Object.assign({}, result, {
      ignore: result.ignore.split(' ').map(a => a.toUpperCase()),
    })
    if (!fs.existsSync(`${userDataFolder}`)) {
      fs.mkdirSync(`${userDataFolder}`)
    }
    const path = `${userDataFolder}/data.json`
    const dataJson = JSON.stringify(data)
    fs.writeFile(path, dataJson, 'utf8', run)
    console.log('Updated user data')
  }
  prompt.get(schema, saveData)
}

sync = async data => {
  const session = new Session(data.username, data.password)
  const courses = await siding.coursesList(session, data.ignore)
  log.coursesFound(courses)
  await Promise.all(courses.map(course => course.scrap()))
  const downloads = courses.map(c => ({
    name: c.name,
    folders: Object.keys(c.folders)
      .filter(id => c.folders[id].shouldCreate(data.path))
      .map(id => c.folders[id]),
    files: Object.keys(c.files)
      .filter(id => c.files[id].shouldDownload(data.path))
      .map(id => c.files[id]),
  }))
  log.coursesFiles(courses, downloads)

  console.log('\nCreating missing folders...')
  courses.forEach(course => course.createFolder(data.path))
  downloads.forEach(d => d.folders.forEach(f => f.create(data.path)))

  console.log('\nStarting downloads, this may take a while...')
  const files = downloads
    .map(download => download.files)
    .reduce((total, arr) => total.concat(arr))
  await Promise.all(files.map(file => file.download(data.path)))
  console.log('\nFinished downloading!')
}

exit = () => {
  console.log('\nTerminated sincding')
}

options = {
  data: data,
  sync: sync,
  exit: exit,
}

optionsDescriptions = {
  data: 'Update your user data',
  sync: 'Download sincding files',
  exit: 'Exit sincding',
}

run = () => {
  console.log('')
  // Load user data
  let userData
  try {
    userData = require(`${userDataFolder}/data.json`)
  } catch (err) {
    userData = null
  }
  if (!userData) {
    return data()
  }
  // Show user data
  console.log('Current user data')
  console.log(`user: ${userData.username}`)
  console.log(`path: ${userData.path}`)
  console.log(`ignore: ${(userData.ignore || []).join(' ')}`)
  console.log('')
  // If a command was supplied in the call, execute it
  const commandLine = options[process.argv[2]]
  if (commandLine) {
    console.log(`Executing \'${process.argv[2]}\' command`)
    process.argv[2] = ''
    return commandLine(userData)
  }
  // Show available commands
  console.log('Commands:')
  Object.keys(options).forEach(key => {
    console.log(` - ${key}: ${optionsDescriptions[key]}`)
  })
  // Prompt user for command
  prompt.start()
  runCommand = (err, result) => {
    if (!result || err) {
      return exit()
    }
    const command = options[result.command]
    if (!command) {
      console.log('Not a valid command')
      return run()
    }
    // Execute selected command
    console.log(`Executing \'${result.command}\' command`)
    options[result.command](userData)
  }
  prompt.get(['command'], runCommand)
}

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60, // 1 hour
}).notify()
console.log('Welcome to sincding!')
console.log(`Version ${pkg.version}`)
run()
