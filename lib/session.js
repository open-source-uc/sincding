const request = require("request").defaults({ jar: true })
const urls = require("./urls")
const axios = require("axios").create({
  adapter: require("axios/lib/adapters/http"),
})

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
    console.log("Starting login")
    axios.defaults.headers.common["Cookie"] = await new Promise(res =>
      request.post({ url: urls.loginURL, form: body }, (err, http) =>
        res(http.headers["set-cookie"][0].replace("; path=/", ""))
      )
    )
    console.log("Checking login")
    const response = await axios.get(urls.main)
    const logged = response.data.indexOf("passwd") === -1
    if (!logged) {
      throw { message: "Login incorrect\nCheck your credentials" }
    }
    console.log("Login correct")
  }
}

module.exports = Session
