# Sincding

[![npm version](https://badge.fury.io/js/sincding.svg)](https://badge.fury.io/js/sincding)

Sincding allows you to download the files from uc siding in an easy way

You must have [node](https://nodejs.org) installed to use it

Install with
```
# with yarn:
yarn global add sincding

# with npm:
npm install -g sincding
```

And then just run
```
sincding
```

Or if you want to just update your files quickly you can run
```
sincding sync
```

On the first run you will be prompted for credentials
```json
{
  "username": "Your uc username without @uc",
  "password": "Your uc password",
  "path": "The absolute path to the folder where you want to download the siding folders and files",
  "ignore": "Space separated acronyms of courses you don't want to download. Usefull for those who are assistants. (example: IIC2154 IIC1103)"
}
```
The credentials are stored in your Home directory on `.sincding/data.json`

***

Let's see it in action  
![demo](https://github.com/open-source-uc/sincding/blob/assets/demo.gif)
