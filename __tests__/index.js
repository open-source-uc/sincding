// const updateNotifier = require("update-notifier")
// const pkg = require("../package.json")
const Session = require("../lib/session")
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

describe("sincding", () => {
  let session

  beforeAll(() => {
    session = new Session(credentials.username, credentials.password)
  })

  it("has valid credentials", () => {
    expect(session.username).toBeTruthy()
    expect(session.password).toBeTruthy()
  })

  it("performs login", async () => {
    await session.login()
  })
})
