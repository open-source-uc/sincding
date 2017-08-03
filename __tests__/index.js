// const updateNotifier = require("update-notifier")
// const pkg = require("../package.json")
// const Session = require("../lib/session")
// const siding = require("../lib/siding")
// const error = require("../lib/error")
// const log = require("./log")

let credentials

beforeAll(() => {
  // Fail if no credentials file
  try {
    credentials = require("./.env.json")
  } catch (err) {
    console.error("Credentials required to run tests")
    console.error(
      "Create a .env.json file in ./__tests__ as specified in README.md"
    )
    process.exit(1)
  }
})

describe("Siding", () => {
  it("has valid credentials", () => {
    expect(credentials.username).toBeTruthy()
    expect(credentials.password).toBeTruthy()
  })
})
