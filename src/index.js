#!/usr/bin/env node

const prompt = require('prompt')
const fs = require('fs')
const os = require('os')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const Session = require('../lib/session')
const siding = require('../lib/siding')
const error = require('../lib/error')
const wait = require('../lib/wait')
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
  try {
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
    await files.reduce(async (promise, file) => {
      await promise
      return file.download(data.path)
    }, Promise.resolve())
    console.log('\nFinished downloading!')
  } catch (err) {
    error(err.message, 'sync')
  }
}

loadUserData = () => {
  let userData = null
  try {
    userData = require(`${userDataFolder}/data.json`)
  } catch (err) {}
  return userData
}

logUser = userData => {
  console.log('Current user data')
  console.log(`user: ${userData.username}`)
  console.log(`path: ${userData.path}`)
  console.log(`ignore: ${(userData.ignore || []).join(' ')}`)
  console.log('')
}

run = async () => {
  console.log('')
  // Load user data
  const userData = loadUserData()
  if (!userData) {
    return data()
  }
  logUser(userData)
  // If a command was supplied in the call, execute it
  const command = process.argv[2]
  if (command) {
    process.argv[2] = ''
    return runCommand(userData, command)
  }
  // Show available commands
  console.log('Commands:')
  Object.keys(options).forEach(key => {
    console.log(` - ${key}: ${optionsDescriptions[key]}`)
  })
  // Prompt user for command
  prompt.start()
  prompt.get(['command'], (err, result) =>
    runCommand(userData, (result || {}).command, err)
  )
}

runCommand = (userData, command, err) => {
  if (err) {
    return options.exit()
  }
  const action = options[command]
  if (!action) {
    console.log('Not a valid command')
    return run()
  }
  // Execute selected command
  console.log(`Executing \'${command}\' command`)
  action(userData)
}

options = {
  data: data,
  sync: sync,
  exit: () => console.log('\nTerminated sincding'),
}

optionsDescriptions = {
  data: 'Update your user data',
  sync: 'Download sincding files',
  exit: 'Exit sincding',
}

const updateCheckInterval = 1000 * 60 * 60
const notifier = updateNotifier({ pkg, updateCheckInterval }).notify() // 1 hour
console.log('Welcome to sincding!')
console.log(`Version ${pkg.version}`)
run()
