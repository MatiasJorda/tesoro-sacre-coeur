# El Tesoro del Sacré Coeur

Búsqueda del tesoro en realidad aumentada para el Edificio Sacré Coeur, hecha con **AR.js** y **A-Frame**. Se juega desde el navegador del celular o de la compu, sin instalar nada.

- **Juego:** https://matiasjorda.github.io/tesoro-sacre-coeur/
- **Marcadores para imprimir:** https://matiasjorda.github.io/tesoro-sacre-coeur/imprimir.html

## Cómo se juega

1. Entrá al juego, escribí tu nombre y dale permiso a la cámara.
2. Apuntá al marcador de la **estación 1** (Hall de entrada). Aparece una brújula en 3D, arranca el reloj y te da la primera pista.
3. Cada pista lleva al lugar de la estación siguiente. Hay que encontrarlas **en orden**: si escaneás una estación antes de tiempo, aparece un candado y te recuerda tu pista actual.
4. En la **estación 5** se abre el cofre del tesoro, con sonido, confeti, tu nombre y el tiempo total.

El progreso queda guardado en el navegador, así que se puede cortar y seguir otro día. El botón **Pistas** muestra las pistas que ya encontraste.

| Estación | Lugar (sugerido) | Qué aparece |
|---|---|---|
| 1 | Hall de entrada | Una brújula |
| 2 | Biblioteca | Un libro abierto |
| 3 | Cantina | Una taza de café humeante |
| 4 | Escalera principal | Una llave dorada |
| 5 | Patio | El cofre, que se abre |

## Preparar el circuito

1. Abrí `imprimir.html` e imprimí en A4, a escala 100 %. La primera hoja es para quien organiza: dice dónde va cada marcador y qué pista lleva a cada lugar.
2. Pegá cada marcador plano, a la altura de los ojos y con buena luz. No tapes el borde blanco y evitá los folios con brillo.
3. El cartel de bienvenida tiene un QR al juego: va cerca de la estación 1.
4. Recorré el circuito con el celular para comprobar que cada marcador se detecta.

## Cambiar la historia o los lugares

Todo el contenido está en [`js/estaciones.js`](js/estaciones.js): el lugar de cada marcador, el texto, la pista siguiente y el modelo 3D. Si cambiás los lugares, volvé a imprimir la primera hoja de `imprimir.html`.

Si un marcador va apoyado sobre una mesa en vez de pegado en una pared, agregale `montaje: 'mesa'` a esa estación para que el modelo aparezca parado encima.

## Probar sin imprimir

- **`?debug`**: agrega botones para simular cada marcador. Sirve para revisar el recorrido completo.
- **`?imagen=marcadores/codigo-2.png`**: usa una imagen fija en lugar de la cámara.
- También se puede abrir un marcador en la pantalla de otro dispositivo y apuntarle con la cámara.

## Cómo está hecho

- **A-Frame 1.6.0** para la escena 3D y **AR.js 3.4.8** para el seguimiento de marcadores. Las dos librerías y los parámetros de cámara están en `vendor/`, así el juego no depende de servidores externos.
- Marcadores de tipo **barcode 3x3_HAMMING63** (`detectionMode: mono_and_matrix`). Tienen corrección de errores, así que un marcador no se confunde con otro. Los 8 códigos posibles están en `marcadores/`.
- Los modelos 3D están armados con primitivas de A-Frame (`a-box`, `a-cylinder`, `a-torus`, etc.) en [`js/modelos.js`](js/modelos.js), con animaciones del componente `animation`.
- La lógica del juego está en [`js/juego.js`](js/juego.js): escucha los eventos `markerFound` y `markerLost`, controla el orden de las pistas, guarda el progreso en `localStorage`, lleva el reloj y genera los sonidos con Web Audio.

### Requisitos del laboratorio

- [x] Proyecto web que funciona en el navegador, sin app nativa.
- [x] AR.js y A-Frame en su última versión estable compatible.
- [x] 5 marcadores distintos, cada uno con un elemento y una pista diferentes.
- [x] Mensaje, animación, sonido y confeti al encontrar el tesoro.
- [x] Publicado en GitHub Pages.
- [x] Opcionales: sonidos, animaciones, reloj y barra de progreso.
