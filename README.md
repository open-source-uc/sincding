# Sincding

[![Greenkeeper badge](https://badges.greenkeeper.io/open-source-uc/sincding.svg)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/open-source-uc/sincding.svg?style=svg)](https://circleci.com/gh/open-source-uc/sincding)
[![npm version](https://badge.fury.io/js/sincding.svg)](https://badge.fury.io/js/sincding)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![dependencies](https://david-dm.org/open-source-uc/sincding.svg)](https://david-dm.org/open-source-uc/sincding)

Sincding allows you to download the files from uc siding in an easy way

**If you aren't familiar with CLI** (command line interface) programs you should check the [video tutorial](https://github.com/open-source-uc/sincding/blob/assets/tutorial.mp4).  
If you are, just keep reading.

You must have [node](https://nodejs.org) installed to use this (version >= 8)

Install with
```bash
npm install -g sincding
```

And then just run
```bash
# Run full program
sincding
# Update files quickly
sincding sync
```

On the first run you will be prompted for credentials
- **username**: Your uc username without @uc
- **password**: Your uc password
- **path**: The absolute path to the folder where you want to download the siding folders and files
- **ignore**: Space separated acronyms of courses you don't want to download. Usefull for those who are assistants. (example: IIC2154 IIC1103)

The credentials are stored in your Home directory on `.sincding/data.json`

Let's see it in action

![demo](https://github.com/open-source-uc/sincding/blob/assets/demo.gif)

***

# Development

Follow this script
```bash
# Clone the repo
git clone https://github.com/open-source-uc/sincding.git
# Cd into directory
cd sincding
# Install dependencies
yarn
```

Run tests
```bash
yarn test
```

Run program
```bash
# Run from project folder
yarn start

# Link it to run it from everywhere
npm link
sincding
```

### Tests

In order for tests to pass you must create a `.env.json` file in `./__tests__` like this
```json
{
  "username": "YOUR_UC_USERNAME",
  "password": "YOUR_UC_PASSWORD"
}
```

Check the [contributing guide](https://github.com/open-source-uc/sincding/blob/dev/CONTRIBUTING.md)
