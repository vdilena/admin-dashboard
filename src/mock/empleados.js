import Mock from 'mockjs'

const empleados = []

const nombres = [
  'Juan Perez',
  'Carolina Gomez',
  'Roberto Gomez',
  'Marianela Jimenez',
  'Santiago Juarez',
  'Mariana Sanabria',
  'Raul Alvarez',
  'Julieta Caceres',
  'Andres Diez',
  'Josefina Martinez'
]

const posiciones = [
  'Desarrollador Jr',
  'Consultor Ssr',
  'Analista de Marketing Sr',
  'Analista de RRHH Ssr',
  'Desarrollador Sr',
  'Desarrollador Arquitecto',
  'Desarrollador Trainee',
  'Analista IT Ssr',
  'Tester lider',
  'Diseñador Jr'
]

const count = 1000

for (let i = 0; i < count; i++) {
  empleados.push(Mock.mock({
    id: '@increment',
    nombre: nombres[Math.round(gaussianRandom(0, 10))],
    posicion: posiciones[Math.round(gaussianRandom(0, 10))],
    experiencia: '@integer(1, 5)',
    puntaje: Math.round(gaussianRandom(0, 10)),
    probabilidadCambio: '@integer(1, 100)',
    'status|1': ['Rechazado', 'Contratado', 'Draft']
  }))
}

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}

function gaussianRandom(start, end) {
  return Math.floor(start + gaussianRand() * (end - start + 1));
}

export function fetchListaEmpleados(query) {
  const page = query.page
  const limit = query.limit
  const pageList = empleados.filter((item, index) => index < limit * page && index >= limit * (page - 1))

  return {
    code: 20000,
    data: {
      total: empleados.length,
      items: pageList
    }
  }
}

export function getCantidadPorPuntaje() {

  let cantidadPorPuntajes = new Array(10).fill(0)

  empleados.forEach(empleado => {
    cantidadPorPuntajes[empleado.puntaje] = cantidadPorPuntajes[empleado.puntaje] + 1
  })

  return cantidadPorPuntajes
}

export function getPuntajeEmpleado() {
  return 5
}

