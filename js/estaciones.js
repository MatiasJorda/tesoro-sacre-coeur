// Configuración del juego. Para cambiar la historia o los lugares, editá solo este archivo.
//
// codigo:  número del marcador impreso (marcadores/codigo-N.png). Tipo 3x3_HAMMING63, valores 0 a 7.
// lugar:   dónde se pega el marcador dentro del edificio. Sale en la hoja para imprimir.
// modelo:  objeto 3D que aparece sobre el marcador (ver js/modelos.js).
// texto:   lo que se descubre al escanear la estación.
// proxima: la pista que lleva a la estación siguiente.
// montaje: 'pared' si el marcador va pegado en una pared, 'mesa' si va apoyado horizontal.
//          Se puede definir para todo el juego o por estación.

window.JUEGO = {
  titulo: 'El Tesoro del Sacré Coeur',
  montaje: 'pared',
  historia:
    'Un exalumno escondió un cofre en algún rincón del Edificio Sacré Coeur y repartió pistas ' +
    'para quien se anime a buscarlo. Cada pista lleva a la siguiente y solo quien las encuentre todas, en orden, podrá abrirlo.',

  estaciones: [
    {
      codigo: 1,
      lugar: 'Hall de entrada',
      titulo: 'La brújula',
      modelo: 'brujula',
      texto:
        'Encontraste la brújula del exalumno. Desde acá empieza la búsqueda y arranca el reloj.',
      proxima:
        'La primera pista duerme entre miles de páginas, en el lugar donde se pide silencio.',
    },
    {
      codigo: 2,
      lugar: 'Biblioteca',
      titulo: 'El libro',
      modelo: 'libro',
      texto:
        'Entre las páginas de este libro había una nota con una mancha de café.',
      proxima:
        'Seguí el olor a café: buscá dónde se recargan energías entre clase y clase.',
    },
    {
      codigo: 3,
      lugar: 'Cantina',
      titulo: 'La taza',
      modelo: 'taza',
      texto:
        'La taza todavía está tibia. En el fondo alguien escribió: «sin ascensor».',
      proxima:
        'Buscá la escalera principal: la llave te espera donde los pasos se cuentan de a uno.',
    },
    {
      codigo: 4,
      lugar: 'Escalera principal',
      titulo: 'La llave dorada',
      modelo: 'llave',
      texto: 'Tenés la llave. Solo falta encontrar qué abre.',
      proxima: 'El cofre está donde el edificio respira al aire libre.',
    },
    {
      codigo: 5,
      lugar: 'Patio',
      titulo: 'El tesoro',
      modelo: 'cofre',
      texto: 'La llave entra justo en la cerradura y el cofre se abre.',
      proxima: '',
    },
  ],
};
