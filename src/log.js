coursesFound = courses => {
  console.log('\nFound courses')
  console.log(courses.map(course => ` - ${course.path()}`).join('\n'), '\n')
}

coursesFiles = (courses, downloads) => {
  console.log('\nFound:')
  const found = courses.map(c => ({
    name: c.name,
    folders: Object.keys(c.folders).length,
    files: Object.keys(c.files).length,
  }))
  coursesSummary(found)
  console.log('\nDownload:')
  const downloadNumbers = downloads.map(download => ({
    name: download.name,
    folders: download.folders.length,
    files: download.files.length,
  }))
  coursesSummary(downloadNumbers)
}

coursesSummary = courses =>
  courses.forEach(c => {
    const log = `
- ${c.name}
  - folders: ${c.folders}
  - files: ${c.files}`
    console.log(log)
  })

module.exports = { coursesFound, coursesFiles }
