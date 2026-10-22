// Lógica del juego: detección de marcadores, orden de las pistas, progreso, reloj y final.

(function () {
  'use strict';

  const JUEGO = window.JUEGO;
  const estaciones = JUEGO.estaciones;
  const total = estaciones.length;
  const CLAVE = 'tesoro-sacre-coeur:v1';
  const params = new URLSearchParams(location.search);
  const imagenPrueba = (params.get('imagen') || '').match(/^[\w\-./]+$/) ? params.get('imagen') : '';
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (id) => document.getElementById(id);
  const mostrar = (el) => { el.hidden = false; refrescarAyuda(); };
  const ocultar = (el) => { el.hidden = true; refrescarAyuda(); };

  // ---------- Estado (se guarda en el navegador para poder seguir otro día) ----------

  const estadoVacio = (nombre = '') => ({ nombre, encontradas: [], inicio: null, fin: null });

  function cargar() {
    try {
      const e = JSON.parse(localStorage.getItem(CLAVE));
      if (e && Array.isArray(e.encontradas)) return e;
    } catch (_) { /* sin almacenamiento: se juega igual */ }
    return estadoVacio();
  }

  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (_) { /* idem */ }
  }

  let estado = cargar();
  const encontrada = (i) => estado.encontradas.includes(estaciones[i].codigo);
  const siguiente = () => estaciones.findIndex((_, i) => !encontrada(i)); // -1 cuando terminó
  const cantidad = () => estaciones.filter((_, i) => encontrada(i)).length;

  // ---------- Sonido (sintetizado, sin archivos) ----------

  const Sonido = (() => {
    let ctx = null;
    function activar() {
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
      } catch (_) { ctx = null; }
      return ctx;
    }
    function nota(freq, desde, dur, tipo = 'triangle', vol = 0.18) {
      const c = activar();
      if (!c) return;
      const t = c.currentTime + desde;
      const osc = c.createOscillator();
      const gan = c.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gan.gain.setValueAtTime(0.0001, t);
      gan.gain.exponentialRampToValueAtTime(vol, t + 0.02);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gan).connect(c.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }
    return {
      activar,
      pista() { [523.25, 659.25, 783.99].forEach((f, i) => nota(f, i * 0.09, 0.4)); },
      bloqueo() { nota(196, 0, 0.18, 'square', 0.06); nota(155.56, 0.17, 0.3, 'square', 0.06); },
      tesoro() {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => nota(f, i * 0.12, 0.3));
        [523.25, 659.25, 783.99, 1046.5].forEach((f) => nota(f, 0.6, 1.4, 'sine', 0.1));
      },
    };
  })();

  const vibrar = (patron) => { try { navigator.vibrate && navigator.vibrate(patron); } catch (_) { /* no soportado */ } };

  // ---------- Escena de realidad aumentada ----------

  let escena = null;
  const marcadores = [];
  const perdido = [];
  const aLaVista = new Set();

  function crearEscena() {
    const fuente = imagenPrueba ? `sourceType: image; sourceUrl: ${imagenPrueba};` : 'sourceType: webcam;';
    const el = document.createElement('a-scene');
    el.setAttribute('embedded', '');
    el.setAttribute(
      'arjs',
      `${fuente} detectionMode: mono_and_matrix; matrixCodeType: 3x3_HAMMING63; ` +
        'cameraParametersUrl: vendor/camera_para.dat; debugUIEnabled: false;'
    );
    el.setAttribute('vr-mode-ui', 'enabled: false');
    el.setAttribute('loading-screen', 'enabled: false');
    el.setAttribute('device-orientation-permission-ui', 'enabled: false');
    el.setAttribute('renderer', 'logarithmicDepthBuffer: true; precision: medium; antialias: true; alpha: true');
    el.innerHTML =
      window.MODELOS.luces +
      estaciones.map((e, i) => window.MODELOS.marcador(e, i, JUEGO.montaje)).join('') +
      '<a-entity camera></a-entity>';
    document.body.appendChild(el);

    el.querySelectorAll('a-marker').forEach((m) => {
      const i = Number(m.dataset.indice);
      marcadores[i] = m;
      perdido[i] = 0;
      m.addEventListener('markerLost', () => {
        perdido[i] = Date.now();
        aLaVista.delete(i);
        refrescarAyuda();
      });
      m.addEventListener('markerFound', () => {
        aLaVista.add(i);
        refrescarAyuda();
        // Si el marcador "parpadea" (se pierde y vuelve enseguida) no repetimos la animación.
        if (Date.now() - perdido[i] < 1500) return;
        alDetectar(i);
      });
    });
    return el;
  }

  function alDetectar(i) {
    if (encontrada(i)) {
      verModelo(i);
      if (i === total - 1) verFinalDeNuevo();
      else mostrarPista(i, false);
      return;
    }
    if (siguiente() === i) {
      desbloquear(i);
      return;
    }
    verCandado(i);
    Sonido.bloqueo();
    vibrar([60, 40, 60]);
    mostrarBloqueo(i);
  }

  function desbloquear(i) {
    if (!estado.inicio) estado.inicio = Date.now();
    estado.encontradas.push(estaciones[i].codigo);
    const termino = siguiente() === -1;
    if (termino) estado.fin = Date.now();
    guardar();
    actualizarHud();
    verModelo(i);
    if (termino) {
      celebrar();
    } else {
      Sonido.pista();
      vibrar(120);
      mostrarPista(i, true);
    }
  }

  function verModelo(i) {
    const m = marcadores[i];
    if (!m) return;
    const contenido = m.querySelector('.contenido');
    m.querySelector('.candado').setAttribute('visible', false);
    contenido.setAttribute('visible', true);
    contenido.emit('aparecer');
    const tapa = m.querySelector('.tapa');
    if (tapa) {
      tapa.setAttribute('rotation', '0 0 0');
      setTimeout(() => {
        tapa.emit('abrir');
        m.querySelector('.brillos').setAttribute('visible', true);
      }, 650);
    }
  }

  function verCandado(i) {
    const m = marcadores[i];
    if (!m) return;
    m.querySelector('.contenido').setAttribute('visible', false);
    const candado = m.querySelector('.candado');
    candado.setAttribute('visible', true);
    candado.firstElementChild.emit('temblar');
  }

  function ocultarModelos() {
    marcadores.forEach((m) => {
      m.querySelector('.contenido').setAttribute('visible', false);
      m.querySelector('.candado').setAttribute('visible', false);
      const brillos = m.querySelector('.brillos');
      if (brillos) brillos.setAttribute('visible', false);
    });
  }

  // ---------- Tarjetas ----------

  const tarjeta = $('tarjeta');

  function llenarTarjeta({ etiqueta, titulo, texto, proxima, boton, tipo }) {
    $('t-etiqueta').textContent = etiqueta;
    $('t-titulo').textContent = titulo;
    $('t-texto').textContent = texto;
    $('t-proxima').textContent = proxima || '';
    $('t-proxima-etiqueta').textContent = tipo === 'bloqueada' ? 'Tu pista actual' : 'Próxima pista';
    $('t-proxima-caja').hidden = !proxima;
    $('t-cerrar').textContent = boton;
    tarjeta.dataset.tipo = tipo;
    // Reinicia la animación de entrada aunque la tarjeta ya estuviera abierta.
    tarjeta.classList.remove('entra');
    void tarjeta.offsetWidth;
    tarjeta.classList.add('entra');
    mostrar(tarjeta);
  }

  function mostrarPista(i, nueva) {
    const e = estaciones[i];
    llenarTarjeta({
      etiqueta: `Estación ${i + 1} de ${total}${nueva ? ' · ¡Pista nueva!' : ''}`,
      titulo: e.titulo,
      texto: e.texto,
      proxima: e.proxima,
      boton: 'Seguir buscando',
      tipo: nueva ? 'nueva' : 'pista',
    });
  }

  function mostrarBloqueo(i) {
    const sig = siguiente();
    const faltan = total - cantidad();
    let texto;
    let proxima = '';
    if (sig === 0) {
      texto = `Este marcador es parte de la búsqueda, pero hay que empezar por el principio. El primero está en: ${estaciones[0].lugar}.`;
    } else if (i === total - 1) {
      texto = `El cofre tiene candado. Te ${faltan - 1 === 1 ? 'falta 1 pista' : `faltan ${faltan - 1} pistas`} para conseguir con qué abrirlo.`;
      proxima = estaciones[sig - 1].proxima;
    } else {
      texto = `Te salteaste una parte del camino. Para desbloquear esta estación primero resolvé la pista de la estación ${sig}.`;
      proxima = estaciones[sig - 1].proxima;
    }
    llenarTarjeta({
      etiqueta: `Estación ${i + 1} de ${total} · Bloqueada`,
      titulo: i === total - 1 ? 'El cofre está cerrado' : 'Todavía no',
      texto,
      proxima,
      boton: 'Entendido',
      tipo: 'bloqueada',
    });
  }

  function verFinalDeNuevo() {
    llenarTarjeta({
      etiqueta: `Estación ${total} de ${total} · Completado`,
      titulo: estaciones[total - 1].titulo,
      texto: `${estaciones[total - 1].texto} Terminaste la búsqueda en ${formatear(estado.fin - estado.inicio)}.`,
      proxima: '',
      boton: 'Ver resultado',
      tipo: 'final',
    });
  }

  $('t-cerrar').addEventListener('click', () => {
    ocultar(tarjeta);
    if (tarjeta.dataset.tipo === 'final') mostrarFinal();
  });

  // ---------- HUD, reloj y panel de pistas ----------

  function actualizarHud() {
    const sig = siguiente();
    $('progreso').innerHTML = estaciones
      .map((e, i) => {
        const clase = encontrada(i) ? 'hecha' : i === sig ? 'actual' : '';
        const etiqueta = `Estación ${i + 1}: ${encontrada(i) ? 'encontrada' : i === sig ? 'la próxima' : 'pendiente'}`;
        return `<li class="${clase}" aria-label="${etiqueta}">${i + 1}</li>`;
      })
      .join('');
    $('progreso-texto').textContent = `${cantidad()}/${total}`;
    actualizarReloj();
  }

  function formatear(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const dos = (n) => String(n).padStart(2, '0');
    if (d) return `${d} d ${h} h`;
    if (h) return `${h}:${dos(m)}:${dos(s % 60)}`;
    return `${dos(m)}:${dos(s % 60)}`;
  }

  function actualizarReloj() {
    const fin = estado.fin || Date.now();
    $('reloj').textContent = estado.inicio ? formatear(fin - estado.inicio) : '00:00';
  }
  setInterval(actualizarReloj, 1000);

  function llenarPanel() {
    const sig = siguiente();
    $('lista-pistas').innerHTML = estaciones
      .map((e, i) => {
        if (encontrada(i)) {
          const detalle = e.proxima || 'Cofre abierto. ¡Tesoro encontrado!';
          return `<li class="hecha"><b>${escapar(e.titulo)}</b><span>${escapar(detalle)}</span></li>`;
        }
        if (i === sig) {
          const ayuda = i === 0 ? `Empezá en: ${escapar(e.lugar)}` : 'Seguí la última pista para encontrarla.';
          return `<li class="actual"><b>Estación ${i + 1}</b><span>${ayuda}</span></li>`;
        }
        return `<li><b>Estación ${i + 1}</b><span>Bloqueada</span></li>`;
      })
      .join('');
  }

  function escapar(texto) {
    const d = document.createElement('div');
    d.textContent = texto;
    return d.innerHTML;
  }

  $('ver-pistas').addEventListener('click', () => { llenarPanel(); mostrar($('panel')); });
  $('cerrar-panel').addEventListener('click', () => ocultar($('panel')));

  function reiniciar() {
    if (!window.confirm('¿Seguro? Se borra todo el progreso y el reloj vuelve a cero.')) return;
    estado = estadoVacio(estado.nombre);
    guardar();
    ocultarModelos();
    actualizarHud();
    ocultar($('panel'));
    ocultar($('final'));
    ocultar(tarjeta);
  }
  $('reiniciar-juego').addEventListener('click', reiniciar);
  $('f-reiniciar').addEventListener('click', reiniciar);
  $('reiniciar').addEventListener('click', () => {
    reiniciar();
    prepararIntro();
  });

  // ---------- Ayuda en pantalla ----------

  function refrescarAyuda() {
    const enJuego = !$('hud').hidden;
    const tapado =
      aLaVista.size > 0 || !tarjeta.hidden || !$('panel').hidden || !$('final').hidden || !$('cargando').hidden;
    $('mira').hidden = !enJuego || tapado;
  }

  // ---------- Final ----------

  function celebrar() {
    Sonido.tesoro();
    vibrar([100, 60, 100, 60, 300]);
    ocultar(tarjeta);
    setTimeout(() => {
      confeti();
      mostrarFinal();
    }, 1800);
  }

  function mostrarFinal() {
    $('f-titulo').textContent = estado.nombre ? `¡Felicitaciones, ${estado.nombre}!` : '¡Felicitaciones!';
    $('f-texto').textContent = `${estaciones[total - 1].texto} Encontraste el tesoro.`;
    $('f-tiempo').textContent = formatear(estado.fin - estado.inicio);
    $('f-estaciones').textContent = `${total} de ${total}`;
    $('f-fecha').textContent = new Date(estado.fin).toLocaleString('es-UY', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
    mostrar($('final'));
  }
  $('f-ver').addEventListener('click', () => ocultar($('final')));

  function confeti() {
    if (reducirMovimiento) return;
    const lienzo = $('confeti');
    const ctx = lienzo.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    lienzo.width = window.innerWidth * dpr;
    lienzo.height = window.innerHeight * dpr;
    lienzo.hidden = false;
    const colores = ['#f2c14e', '#e3a83a', '#b23a2e', '#f4ead5', '#5fb3a6'];
    const piezas = Array.from({ length: 170 }, () => ({
      x: Math.random() * lienzo.width,
      y: -Math.random() * lienzo.height * 0.6,
      w: (6 + Math.random() * 6) * dpr,
      h: (10 + Math.random() * 8) * dpr,
      vx: (Math.random() - 0.5) * 3 * dpr,
      vy: (2 + Math.random() * 4) * dpr,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colores[Math.floor(Math.random() * colores.length)],
    }));
    const t0 = performance.now();
    (function paso(t) {
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      piezas.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05 * dpr;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (t - t0 < 5000) requestAnimationFrame(paso);
      else { ctx.clearRect(0, 0, lienzo.width, lienzo.height); lienzo.hidden = true; }
    })(t0);
  }

  // ---------- Inicio ----------

  function prepararIntro() {
    $('titulo').textContent = JUEGO.titulo;
    $('historia').textContent = JUEGO.historia;
    $('nombre').value = estado.nombre || '';
    const hechas = cantidad();
    $('empezar').textContent = hechas ? `Continuar (${hechas}/${total})` : 'Empezar la búsqueda';
    $('reiniciar').hidden = !hechas;
  }

  $('intro-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    estado.nombre = $('nombre').value.trim().slice(0, 40);
    guardar();
    Sonido.activar();
    ocultar($('intro'));
    mostrar($('hud'));
    mostrar($('cargando'));
    actualizarHud();
    if (!escena) escena = crearEscena();
    if (imagenPrueba) setTimeout(() => ocultar($('cargando')), 1500);
    if (siguiente() === -1) setTimeout(mostrarFinal, 400);
  });

  window.addEventListener('arjs-video-loaded', () => ocultar($('cargando')));
  window.addEventListener('camera-error', () => {
    $('cargando').classList.add('error');
    $('cargando-texto').textContent =
      'No pudimos usar la cámara. Revisá que el navegador tenga permiso para usarla y volvé a intentar.';
    $('reintentar').hidden = false;
  });
  $('reintentar').addEventListener('click', () => location.reload());

  // ---------- Modo prueba: ?debug muestra botones para simular cada marcador ----------

  if (params.has('debug')) {
    const panel = $('depuracion');
    panel.innerHTML = estaciones
      .map((e, i) => `<button type="button" data-i="${i}">Simular ${i + 1}</button>`)
      .join('');
    panel.addEventListener('click', (ev) => {
      const i = ev.target.dataset && ev.target.dataset.i;
      if (i !== undefined) alDetectar(Number(i));
    });
    panel.hidden = false;
  }

  prepararIntro();
})();
