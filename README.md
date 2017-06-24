# Sincding

[![Greenkeeper badge](https://badges.greenkeeper.io/open-source-uc/sincding.svg)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/open-source-uc/sincding.svg?style=svg)](https://circleci.com/gh/open-source-uc/sincding)
[![npm version](https://badge.fury.io/js/sincding.svg)](https://badge.fury.io/js/sincding)
[![dependencies](https://david-dm.org/open-source-uc/sincding.svg)](https://david-dm.org/open-source-uc/sincding)

Sincding allows you to download the files from uc siding in an easy way

**If you aren't familiar with CLI** (command line interface) programs you should check the [video tutorial](https://github.com/open-source-uc/sincding/blob/assets/tutorial.mp4).  
If you are, just keep reading.

You must have [node](https://nodejs.org) installed to use this (version >= 8)

Install with
```bash
# with yarn:
yarn global add sincding

# with npm:
npm install -g sincding
```

And then just run
```bash
sincding
```

Or if you want to just update your files quickly you can run
```bash
sincding sync
```

On the first run you will be prompted for credentials
- **username**: Your uc username without @uc
- **password**: Your uc password
- **path**: The absolute path to the folder where you want to download the siding folders and files
- **ignore**: Space separated acronyms of courses you don't want to download. Usefull for those who are assistants. (example: IIC2154 IIC1103)

The credentials are stored in your Home directory on `.sincding/data.json`

***

Let's see it in action

![demo](https://github.com/open-source-uc/sincding/blob/assets/demo.gif)

***

## Development

Clone the repo
```bash
git clone https://github.com/open-source-uc/sincding.git
```

Install dependencies
```bash
# with yarn:
yarn

# with npm:
npm i
```

To test you have two options
```bash
# run from project folder
npm start
# or
node src/index.js

# or link it to run it from everywhere
npm link
sincding
```

Check the [contributing guide](https://github.com/open-source-uc/sincding/blob/dev/CONTRIBUTING.md)
