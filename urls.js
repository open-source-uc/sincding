const urls = {
  domain: 'intrawww.ing.puc.cl',
  main: 'https://intrawww.ing.puc.cl/siding',
  loginURL: 'https://intrawww.ing.puc.cl/siding/index.phtml',
  coursesURL: 'https://intrawww.ing.puc.cl/siding/dirdes/ingcursos/cursos/index.phtml?per_lista_cursos=21_2017&acc_inicio=mis_cursos',
  courseURL: id =>
    `https://intrawww.ing.puc.cl/siding/dirdes/ingcursos/cursos/index.phtml?accion_curso=avisos&id_curso_ic=${id}`,
  courseFolderURL: link =>
    `https://intrawww.ing.puc.cl/siding/dirdes/ingcursos/cursos/${link}`,
  courseFileURL: link => `https://intrawww.ing.puc.cl${link}`,
};

module.exports = urls;
