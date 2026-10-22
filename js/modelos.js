// Modelos 3D de cada estación, armados con primitivas de A-Frame (no dependen de archivos externos).
// Convención: cada modelo mira hacia +Z, con +Y hacia arriba y centrado en el origen.
// El marcador mide 1 unidad de lado.

(function () {
  'use strict';

  const ORO = 'color: #e3a83a; metalness: 0.3; roughness: 0.35; emissive: #3d2800';
  const MADERA = 'color: #7a4a21; roughness: 0.85';
  const PAPEL = 'color: #f4ead5; roughness: 0.9';

  const lineas = (x0) =>
    [-0.27, -0.18, -0.09, 0, 0.09, 0.18, 0.27]
      .map(
        (z) =>
          `<a-box position="${x0} 0.068 ${z}" width="0.36" height="0.004" depth="0.022" color="#8b7d66"></a-box>`
      )
      .join('');

  const modelos = {
    brujula: `
      <a-entity animation__mirar="property: rotation; from: 0 -18 0; to: 0 18 0; dir: alternate; loop: true; dur: 2400; easing: easeInOutSine">
        <a-entity rotation="90 0 0">
          <a-cylinder radius="0.5" height="0.1" material="${MADERA}"></a-cylinder>
          <a-torus radius="0.47" radius-tubular="0.035" rotation="90 0 0" position="0 0.05 0" material="${ORO}"></a-torus>
          <a-cylinder radius="0.44" height="0.02" position="0 0.06 0" material="${PAPEL}"></a-cylinder>
          <a-box width="0.05" height="0.02" depth="0.12" position="0 0.075 -0.34" color="#2a2119"></a-box>
          <a-box width="0.05" height="0.02" depth="0.12" position="0 0.075 0.34" color="#2a2119"></a-box>
          <a-box width="0.12" height="0.02" depth="0.05" position="0.34 0.075 0" color="#2a2119"></a-box>
          <a-box width="0.12" height="0.02" depth="0.05" position="-0.34 0.075 0" color="#2a2119"></a-box>
          <a-entity position="0 0.1 0" animation__aguja="property: rotation; from: 0 -28 0; to: 0 28 0; dir: alternate; loop: true; dur: 900; easing: easeInOutSine">
            <a-cone radius-bottom="0.07" radius-top="0" height="0.32" rotation="-90 0 0" position="0 0 -0.16" color="#b23a2e"></a-cone>
            <a-cone radius-bottom="0.07" radius-top="0" height="0.32" rotation="90 0 0" position="0 0 0.16" color="#e8e1d0"></a-cone>
            <a-sphere radius="0.05" material="${ORO}"></a-sphere>
          </a-entity>
        </a-entity>
      </a-entity>`,

    libro: `
      <a-entity scale="0.85 0.85 0.85" animation__mirar="property: rotation; from: 0 -14 0; to: 0 14 0; dir: alternate; loop: true; dur: 2600; easing: easeInOutSine">
        <a-entity rotation="90 0 0">
          <a-entity rotation="0 0 -14">
            <a-box position="-0.3 0 0" width="0.6" height="0.04" depth="0.8" color="#7a2e2a"></a-box>
            <a-box position="-0.29 0.04 0" width="0.56" height="0.05" depth="0.74" material="${PAPEL}"></a-box>
            ${lineas(-0.3)}
          </a-entity>
          <a-entity rotation="0 0 14">
            <a-box position="0.3 0 0" width="0.6" height="0.04" depth="0.8" color="#7a2e2a"></a-box>
            <a-box position="0.29 0.04 0" width="0.56" height="0.05" depth="0.74" material="${PAPEL}"></a-box>
            ${lineas(0.3)}
          </a-entity>
          <a-cylinder radius="0.04" height="0.8" rotation="90 0 0" color="#5a201d"></a-cylinder>
        </a-entity>
        <a-plane width="0.26" height="0.18" position="0.12 0.1 0.22" rotation="0 0 -12" color="#f2d48a"
          animation__nota="property: position; from: 0.12 0.08 0.22; to: 0.12 0.2 0.26; dir: alternate; loop: true; dur: 1300; easing: easeInOutSine"></a-plane>
      </a-entity>`,

    taza: `
      <a-entity position="0 -0.25 0">
        <a-cylinder radius="0.42" height="0.04" material="${PAPEL}"></a-cylinder>
        <a-cylinder radius="0.24" height="0.02" position="0 0.03 0" color="#ffffff"></a-cylinder>
        <a-cylinder radius="0.24" height="0.42" open-ended="true" position="0 0.24 0" material="color: #ffffff; side: double"></a-cylinder>
        <a-torus radius="0.24" radius-tubular="0.014" rotation="90 0 0" position="0 0.38 0" color="#b23a2e"></a-torus>
        <a-cylinder radius="0.225" height="0.01" position="0 0.39 0" color="#4a2c17"></a-cylinder>
        <a-torus radius="0.11" radius-tubular="0.03" arc="180" rotation="0 0 -90" position="0.25 0.24 0" color="#ffffff"></a-torus>
        <a-sphere radius="0.05" position="-0.06 0.45 0" material="color: #ffffff; transparent: true; opacity: 0.6"
          animation__sube="property: position; from: -0.06 0.45 0; to: -0.12 0.95 0; loop: true; dur: 1800; easing: easeOutSine"
          animation__esfuma="property: components.material.material.opacity; from: 0.6; to: 0; loop: true; dur: 1800; easing: easeInSine"></a-sphere>
        <a-sphere radius="0.045" position="0.05 0.45 0" material="color: #ffffff; transparent: true; opacity: 0.6"
          animation__sube="property: position; from: 0.05 0.45 0; to: 0.1 0.95 0; loop: true; dur: 1800; delay: 600; easing: easeOutSine"
          animation__esfuma="property: components.material.material.opacity; from: 0.6; to: 0; loop: true; dur: 1800; delay: 600; easing: easeInSine"></a-sphere>
        <a-sphere radius="0.04" position="0 0.45 0" material="color: #ffffff; transparent: true; opacity: 0.6"
          animation__sube="property: position; from: 0 0.45 0; to: 0 0.95 0; loop: true; dur: 1800; delay: 1200; easing: easeOutSine"
          animation__esfuma="property: components.material.material.opacity; from: 0.6; to: 0; loop: true; dur: 1800; delay: 1200; easing: easeInSine"></a-sphere>
      </a-entity>`,

    llave: `
      <a-entity animation__girar="property: rotation; from: 0 0 0; to: 0 360 0; loop: true; dur: 4000; easing: linear">
        <a-entity rotation="0 0 -25">
          <a-torus radius="0.15" radius-tubular="0.045" position="-0.38 0 0" material="${ORO}"></a-torus>
          <a-sphere radius="0.06" position="-0.38 0 0" color="#b23a2e"></a-sphere>
          <a-cylinder radius="0.06" height="0.05" rotation="0 0 90" position="-0.2 0 0" material="${ORO}"></a-cylinder>
          <a-cylinder radius="0.04" height="0.62" rotation="0 0 90" position="0.06 0 0" material="${ORO}"></a-cylinder>
          <a-box width="0.07" height="0.17" depth="0.05" position="0.32 -0.1 0" material="${ORO}"></a-box>
          <a-box width="0.07" height="0.11" depth="0.05" position="0.19 -0.07 0" material="${ORO}"></a-box>
        </a-entity>
      </a-entity>`,

    cofre: `
      <a-entity position="0 -0.25 0" animation__mirar="property: rotation; from: 0 -12 0; to: 0 12 0; dir: alternate; loop: true; dur: 3000; easing: easeInOutSine">
        <a-box width="0.8" height="0.4" depth="0.5" position="0 0.2 0" material="${MADERA}"></a-box>
        <a-box width="0.82" height="0.05" depth="0.52" position="0 0.375 0" material="${ORO}"></a-box>
        <a-box width="0.82" height="0.05" depth="0.52" position="0 0.03 0" material="${ORO}"></a-box>
        <a-box width="0.05" height="0.4" depth="0.52" position="-0.3 0.2 0" material="${ORO}"></a-box>
        <a-box width="0.05" height="0.4" depth="0.52" position="0.3 0.2 0" material="${ORO}"></a-box>
        <a-box width="0.13" height="0.15" depth="0.02" position="0 0.29 0.26" material="${ORO}"></a-box>
        <a-box width="0.025" height="0.06" depth="0.01" position="0 0.28 0.272" color="#1f1a17"></a-box>
        <a-entity class="oro">
          <a-sphere radius="0.26" scale="1.35 0.42 0.8" position="0 0.4 0" material="color: #f2c14e; metalness: 0.3; roughness: 0.3; emissive: #8a5c00; emissiveIntensity: 0.6"></a-sphere>
          <a-cylinder radius="0.07" height="0.02" position="-0.18 0.5 0.05" rotation="20 0 15" material="${ORO}"></a-cylinder>
          <a-cylinder radius="0.07" height="0.02" position="0.15 0.49 -0.02" rotation="-15 0 -20" material="${ORO}"></a-cylinder>
          <a-cylinder radius="0.07" height="0.02" position="0.02 0.52 0.08" rotation="30 0 5" material="${ORO}"></a-cylinder>
          <a-octahedron radius="0.07" position="-0.05 0.53 -0.06" material="color: #5fb3a6; emissive: #1d5c53"></a-octahedron>
        </a-entity>
        <a-entity class="brillos" visible="false">
          <a-octahedron radius="0.035" position="-0.25 0.75 0.1" material="color: #fff3b0; emissive: #ffd36b; emissiveIntensity: 0.9"
            animation__brillo="property: position; from: -0.25 0.6 0.1; to: -0.3 0.95 0.1; dir: alternate; loop: true; dur: 900; easing: easeInOutSine"></a-octahedron>
          <a-octahedron radius="0.03" position="0.22 0.8 0" material="color: #fff3b0; emissive: #ffd36b; emissiveIntensity: 0.9"
            animation__brillo="property: position; from: 0.22 0.62 0; to: 0.3 1 0; dir: alternate; loop: true; dur: 1100; easing: easeInOutSine"></a-octahedron>
          <a-octahedron radius="0.04" position="0 0.9 0.15" material="color: #fff3b0; emissive: #ffd36b; emissiveIntensity: 0.9"
            animation__brillo="property: position; from: 0 0.7 0.15; to: 0.04 1.1 0.15; dir: alternate; loop: true; dur: 1300; easing: easeInOutSine"></a-octahedron>
        </a-entity>
        <a-entity class="tapa" position="0 0.4 -0.25"
          animation__abrir="property: rotation; from: 0 0 0; to: -115 0 0; dur: 1300; easing: easeOutBack; startEvents: abrir">
          <a-cylinder radius="0.25" height="0.8" theta-start="0" theta-length="180" rotation="0 0 90" position="0 0 0.25" material="${MADERA}; side: double"></a-cylinder>
          <a-circle radius="0.25" theta-start="0" theta-length="180" rotation="0 90 0" position="0.4 0 0.25" material="${MADERA}; side: double"></a-circle>
          <a-circle radius="0.25" theta-start="0" theta-length="180" rotation="0 90 0" position="-0.4 0 0.25" material="${MADERA}; side: double"></a-circle>
          <a-torus radius="0.25" radius-tubular="0.022" arc="180" rotation="0 90 0" position="0.3 0 0.25" material="${ORO}"></a-torus>
          <a-torus radius="0.25" radius-tubular="0.022" arc="180" rotation="0 90 0" position="-0.3 0 0.25" material="${ORO}"></a-torus>
        </a-entity>
      </a-entity>`,
  };

  const candado = `
    <a-entity animation__temblar="property: rotation; from: 0 0 -9; to: 0 0 9; dir: alternate; loop: 6; dur: 70; easing: easeInOutSine; startEvents: temblar">
      <a-box width="0.5" height="0.42" depth="0.18" position="0 -0.12 0" material="color: #6f6a63; metalness: 0.2; roughness: 0.5"></a-box>
      <a-torus radius="0.16" radius-tubular="0.045" arc="180" position="0 0.09 0" material="color: #b9b3aa; metalness: 0.2; roughness: 0.4"></a-torus>
      <a-cylinder radius="0.045" height="0.02" rotation="90 0 0" position="0 -0.07 0.095" color="#1f1a17"></a-cylinder>
      <a-box width="0.03" height="0.1" depth="0.02" position="0 -0.14 0.095" color="#1f1a17"></a-box>
    </a-entity>`;

  // Pared: el marcador está pegado vertical y el modelo sale hacia quien mira.
  // Mesa: el marcador está apoyado horizontal y el modelo se para encima.
  const SOPORTES = {
    pared: 'position="0 0.35 0" rotation="-90 0 0" scale="0.9 0.9 0.9"',
    mesa: 'position="0 0.55 0" rotation="0 0 0" scale="0.9 0.9 0.9"',
  };

  function marcador(estacion, indice, montajeGeneral) {
    const soporte = SOPORTES[estacion.montaje || montajeGeneral] || SOPORTES.pared;
    return `
      <a-marker type="barcode" value="${estacion.codigo}" data-indice="${indice}" visible="false"
        smooth="true" smoothCount="5" smoothTolerance="0.01" smoothThreshold="2">
        <a-entity ${soporte}>
          <a-entity class="contenido" visible="false" scale="0.01 0.01 0.01"
            animation__aparecer="property: scale; from: 0.01 0.01 0.01; to: 1 1 1; dur: 700; easing: easeOutBack; startEvents: aparecer">
            <a-entity animation__flotar="property: position; from: 0 -0.04 0; to: 0 0.04 0; dir: alternate; loop: true; dur: 1500; easing: easeInOutSine">
              ${modelos[estacion.modelo] || modelos.brujula}
            </a-entity>
          </a-entity>
          <a-entity class="candado" visible="false">${candado}</a-entity>
        </a-entity>
      </a-marker>`;
  }

  const luces = `
    <a-entity light="type: ambient; color: #ffffff; intensity: 0.8"></a-entity>
    <a-entity light="type: directional; color: #fff6e5; intensity: 1" position="0.6 1 1"></a-entity>`;

  window.MODELOS = { marcador, luces };
})();
