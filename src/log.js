const Table = require("cli-table")

const coursesFound = courses => {
  console.log("\nFound courses")
  console.log(courses.map(course => ` - ${course.path()}`).join("\n"), "\n")
}

const downloadPreview = downloads => {
  const preview = new Table({
    head: ["Course", "Files", "Files"],
  })
  downloads.forEach(d => {
    preview.push([
      d.name,
      `${d.files.length} / ${d.filesAll.length}`,
      `${d.folders.length} / ${d.foldersAll.length}`,
    ])
  })
  console.log("")
  console.log(preview.toString())
}

const logUser = userData => {
  console.log("Current user data")
  console.log(`user: ${userData.username}`)
  console.log(`path: ${userData.path}`)
  console.log(`ignore: ${(userData.ignore || []).join(" ")}`)
}

module.exports = { coursesFound, downloadPreview, logUser }
