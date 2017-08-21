const request = require("request").defaults({ jar: true })
const urls = require("./urls")
const axios = require("axios")
const log = require("./log")

const loginFail = { message: "Login incorrect\nCheck your credentials" }

class Session {
  constructor(username, password) {
    this.username = username
    this.password = password
  }

  async login() {
    const body = {
      login: this.username,
      passwd: this.password,
      sw: "",
      sh: "",
      cd: "",
    }
    log("Login to siding... ", { partial: true })
    axios.defaults.headers.common["Cookie"] = await new Promise((res, rej) =>
      request.post({ url: urls.loginURL, form: body }, (err, http) => {
        try {
          res(http.headers["set-cookie"][0].replace("; path=/", ""))
        } catch (e) {
          rej(loginFail)
        }
      })
    )
    log("check login... ", { partial: true })
    const response = await axios.get(urls.main)
    const logged = response.data.indexOf("passwd") === -1
    if (!logged) {
      throw loginFail
    }
    log.ok()
    return this
  }
}

module.exports = Session
