const cheerio = require("cheerio")
const iconv = require("iconv-lite")
const axios = require("axios")
const urls = require("./urls")
const course = require("./course")
const log = require("./log")

class Siding {
  static async coursesList(session, ignore = []) {
    axios.defaults.responseType = "arraybuffer"
    axios.defaults.transformResponse = [
      data => iconv.decode(data, "ISO-8859-1"),
    ]
    await session.login()
    log("Getting courses list")
    const html = (await axios.get(urls.coursesURL)).data
    return Siding.coursesListFromHtml(html, ignore)
  }

  static coursesListFromHtml(html, ignore = []) {
    log("Parsing courses list")
    const courses = []
    const $ = cheerio.load(html)
    $("a").each((i, l) => {
      const link = $(l).attr("href")
      if (link.indexOf("id_curso_ic") === -1) {
        return
      }
      const courseId = link.split("id_curso_ic=")[1]
      const courseSplit = $(l).text().split(/ s\.[0-9] /)
      const courseAcronym = courseSplit[0]
      if (ignore.indexOf(courseAcronym) !== -1) {
        return
      }
      const courseName = courseSplit[1]
      courses.push(new course(courseId, courseAcronym, courseName))
    })
    return courses
  }
}

module.exports = Siding
