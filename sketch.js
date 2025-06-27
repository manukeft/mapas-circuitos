// Configuración de la grilla
const res = 30;
const minDist = res / 2;
let tamCelda = 0;

// Estado del juego
let pantalla = "inicio";
let temaPCB = false;
let particula = { active: false, line: -1, progress: 0, speed: 0.005, x: 0, y: 0 }; 

// Datos del mapa
let grilla = [];
let lineas = [];
let lineaColor = [];
let estaciones = [];
let nombreEstaciones = [];
let terminales = [];
let nombreLinea = [];
let nombreRed = "";

// Configuración de botones
let botones = {
  iniciar: { x: 0, y: 0, w: 0, h: 0 },
  salir: { x: 0, y: 0, w: 0, h: 0 },
  volver: { x: 0, y: 0, w: 0, h: 0 },
  tema: { x: 0, y: 0, w: 0, h: 0 }
};

// Sonido
let sonidoSubte;
let sonidoParticula;

function preload() {
  try {
    sonidoSubte = loadSound('subte.mp3');
    sonidoSubte.setVolume(0.5);
    sonidoParticula = loadSound('sonido2.mp3');
    sonidoParticula.setVolume(0.5); 
  } catch (e) {
    console.error("Error al cargar sonidos:", e);
  }
}

function setup() {
  console.log("Iniciando sketch.js...");
  let dim = min(windowWidth, windowHeight) * 0.9;
  let canvas = createCanvas(dim, dim);
  canvas.parent('canvas-container');
  tamCelda = floor(width / res);
  resizeCanvas(res * tamCelda, res * tamCelda);
  pixelDensity(2);

  actualizarPosBot();
  if (pantalla === "mapa") {
    mostrarMapa();
  }
}

function draw() {
  if (pantalla === "inicio") {
    dibujarPantallaInicio();
  } else if (pantalla === "mapa") {
    dibujarMapa(temaPCB, particula, botones, sonidoSubte, sonidoParticula);
  } else if (pantalla === "fin") {
    dibujarPantallaFin();
  }
}

function mousePressed() {
  if (pantalla === "inicio" && siBotonClickeado(botones.iniciar)) {
    pantalla = "mapa";
    mostrarMapa();
  } else if (pantalla === "mapa") {
    if (siBotonClickeado(botones.salir)) {
      pantalla = "fin";
      pararParticula(particula, temaPCB ? sonidoParticula : sonidoSubte);
    } else if (siBotonClickeado(botones.tema)) {
      temaPCB = !temaPCB;
      if (particula.active) {
        pararParticula(particula, temaPCB ? sonidoParticula : sonidoSubte);
      }
    } else {
      siEstacionClickeada(temaPCB, particula, sonidoSubte, sonidoParticula);
    }
  } else if (pantalla === "fin" && siBotonClickeado(botones.volver)) {
    pantalla = "inicio";
    reiniciarMapa();
  }
}

function keyPressed() {
  if (pantalla === "mapa" && keyCode === ESCAPE) {
    pantalla = "fin";
    pararParticula(particula, temaPCB ? sonidoParticula : sonidoSubte);
  }
}

function windowResized() {
  let dim = min(windowWidth, windowHeight) * 0.9;
  resizeCanvas(dim, dim);
  tamCelda = floor(width / res);
  resizeCanvas(res * tamCelda, res * tamCelda);
  actualizarPosBot();
}