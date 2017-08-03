// const updateNotifier = require("update-notifier")
// const pkg = require("../package.json")
// const Session = require("../lib/session")
// const siding = require("../lib/siding")
// const error = require("../lib/error")
// const log = require("./log")

let credentials

beforeAll(() => {
  try {
    credentials = require("./.env.json")
  } catch (err) {
    console.error(
      "Credentials required to run tests\nCreate a .env.json file in ./__tests__ as specified in README.md"
    )
  }
})

// Fail if no credentials loaded
if (!credentials) {
  test.only("ERROR: No credentials", () => {})
}

describe("Siding", () => {
  it("has valid credentials", () => {
    expect(credentials.username).toBeTruthy()
    expect(credentials.password).toBeTruthy()
  })
})
