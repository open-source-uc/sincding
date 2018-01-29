const baseURL = "https://intrawww.ing.puc.cl/siding"
const courseURL = "/dirdes/ingcursos/cursos"

const urls = {
  domain: "intrawww.ing.puc.cl",
  main: baseURL,
  loginURL: `${baseURL}/index.phtml`,
  currentCoursesURL: `${baseURL}${courseURL}/index.phtml?per_lista_cursos=21_2018&acc_inicio=mis_cursos`,
  coursesFromURL: (year, term) =>
    `${baseURL}${courseURL}/index.phtml?per_lista_cursos=2${term}_${year}&acc_inicio=mis_cursos`,
  courseURL: id =>
    `${baseURL}${courseURL}/index.phtml?accion_curso=avisos&id_curso_ic=${id}`,
  courseFolderURL: link => `${baseURL}${courseURL}/${link}`,
  courseFileURL: link => `https://intrawww.ing.puc.cl${link}`,
  catalogFromURL: (year, term) =>
    `${baseURL}${courseURL}/index.phtml?acc_inicio=catalogo&per_lista_cursos=2${term}_${year}`,
}

module.exports = urls
