let destellos = [];

const colores = ["red", "darkorange", "yellow", "limegreen", "dodgerblue", "darkviolet", "violet", "darkslategray"];
const coloresNombres = {
  red: "Roja",
  darkorange: "Naranja",
  yellow: "Amarilla",
  limegreen: "Verde",
  dodgerblue: "Celeste",
  darkviolet: "Violeta",
  violet: "Rosa",
  darkslategray: "Gris"
};
const redTipo = ["Subte", "Tren", "Ferrocarril", "Tranvía", "Premetro", "Metro", "Tren Ligero", "Monorraíl"];
const estacionesNombres = [
  "Resistencia", "Condensador", "Transistor", "Diodo", "Inductor", "Relé", "Soldadura", "Pista",
  "Almohadilla", "Vía", "Chip", "Circuito", "Placa", "Silicio", "Microchip", "Procesador",
  "Memoria", "Bus", "Puerta", "Lógica", "NAND", "NOR", "FlipFlop", "Oscilador",
  "Amplificador", "Filtro", "Regulador", "Convertidor", "Transformador", "Fusible",
  "Interruptor", "Conector", "Pin", "Zócalo", "LED", "Sensor", "Actuador", "Núcleo",
  "Caché", "Registro", "Reloj", "Señal", "Tierra", "Energía", "Voltio", "Amperio",
  "Ohmio", "Vatio", "Faradio", "Henrio"
];

function generarMapa() {
  let grilla = [];
  for (let i = 0; i < res; i++) {
    grilla[i] = [];
    for (let j = 0; j < res; j++) {
      grilla[i][j] = ["gray"];
    }
  }
  return grilla;
}

function generarLineas() {
  let cantidadLineas = floor(random(5, 9));
  let linea = [], lineaColor = [], estaciones = [], terminales = [];
  
  for (let i = 0; i < cantidadLineas; i++) {
    let r = floor(random(colores.length));
    while (lineaColor.includes(r)) r = floor(random(colores.length));
    lineaColor[i] = r;
    linea[i] = [];

    let inicioX = floor(random(2, res - 2));
    let inicioY = floor(random(2, res - 2));
    let finX = floor(random(2, res - 2));
    let finY = floor(random(2, res - 2));
    
    while (dist(finX, finY, inicioX, inicioY) < minDist) {
      finX = floor(random(2, res - 2));
      finY = floor(random(2, res - 2));
    }

    linea[i].push([inicioX, inicioY]);
    agregarEstacion(estaciones, terminales, grilla, inicioX, inicioY, i, true);
    grilla[inicioX][inicioY].push(i);

    let xDif = finX - inicioX, yDif = finY - inicioY;
    let xs = Array(abs(xDif)).fill(Math.sign(xDif));
    let ys = Array(abs(yDif)).fill(Math.sign(yDif));
    let dif = abs(xDif) - abs(yDif);

    if (abs(xDif) > abs(yDif)) {
      for (let n = 0; n < dif; n++) ys.splice(floor(random(ys.length)), 0, 0);
    } else {
      for (let n = 0; n < -dif; n++) xs.splice(floor(random(xs.length)), 0, 0);
    }

    let x = inicioX, y = inicioY, len = 3, overlap = 0;
    for (let n = 0; n < xs.length - 1; n++) {
      x += xs[n];
      y += ys[n];
      if (grilla[x][y][1] != undefined) {
        overlap++;
        linea[i].push([x, y]);
        estaciones.push([x, y, 1, i]);
        len = 3;
      } else {
        if (overlap > 1) {
          let last = estaciones[estaciones.length - 1];
          let prev = estaciones[estaciones.length - 2];
          let xDif = last[0] - prev[0];
          let yDif = last[1] - prev[1];
          let xStart = last[0] - overlap * xDif;
          let yStart = last[1] - overlap * yDif;
          for (let q = 0; q < overlap; q++) {
            estaciones.pop();
            linea[i].pop();
          }
          for (let q = 0; q < overlap; q++) {
            xStart += xDif;
            yStart += yDif;
          }
        }
        overlap = 0;
        linea[i].push([x, y]);
        if (random() < 0.8 && len > 0) {
          len--;
        } else if (len === 0) {
          len = 3;
          estaciones.push([x, y, 0, i]);
        }
      }
      grilla[x][y].push(i);
    }

    linea[i].push([finX, finY]);
    agregarEstacion(estaciones, terminales, grilla, finX, finY, i, false);
    grilla[finX][finY].push(i);
  }
  
  return { linea, lineaColor, estaciones, terminales };
}

function agregarEstacion(estaciones, terminales, grilla, x, y, lineIndex, isStart) {
  let isInterchange = grilla[x][y][1] != undefined;
  terminales.push(estaciones.length);
  estaciones.push([x, y, isInterchange ? 1 : 0, lineIndex]);
}

function generarNombre(estaciones, lineaColor) {
  let nombreEstaciones = [], nombreLinea = [];
  let nombresDispo = [...estacionesNombres];
  
  for (let i = 0; i < estaciones.length; i++) {
    let name = nombresDispo.splice(floor(random(nombresDispo.length)), 1)[0];
    nombreEstaciones.push(name);
  }
  
  for (let i = 0; i < lineaColor.length; i++) {
    nombreLinea.push(coloresNombres[colores[lineaColor[i]]]);
  }
  
  let nombreRed = random(redTipo);
  return { nombreEstaciones, nombreLinea, nombreRed };
}

function mostrarMapa() {
  grilla = generarMapa();
  let { linea: nuevaLinea, lineaColor: nuevaLineaColor, estaciones: nuevasEstaciones, terminales: nuevasTerminales } = generarLineas();
  linea = nuevaLinea;
  lineaColor = nuevaLineaColor;
  estaciones = nuevasEstaciones;
  terminales = nuevasTerminales;
  let { nombreEstaciones: newStationNames, nombreLinea: newLineNames, nombreRed: newNetworkName } = generarNombre(estaciones, lineaColor); // Corregido newCypress
  nombreEstaciones = newStationNames;
  nombreLinea = newLineNames;
  nombreRed = newNetworkName;
  destellos = []; // reinicia
}

function dibujarPantallaInicio() {
  background(22, 24, 24);
  fill(240);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(width * 0.08);
  text("Mapas Circuitos", width * 0.5, height * 0.3);
  textSize(width * 0.035);
  text("Creado por: manukeft", width * 0.5, height * 0.45);
  text("Proyecto Final - OTAV 1 Digitalización", width * 0.5, height * 0.5);
  text("2025", width * 0.5, height * 0.55);
  fill("limegreen");
  stroke(255);
  strokeWeight(width * 0.004);
  rect(botones.iniciar.x, botones.iniciar.y, botones.iniciar.w, botones.iniciar.h, width * 0.02);
  fill(240);
  noStroke();
  textSize(width * 0.04);
  text("Iniciar", width * 0.5, height * 0.7);
  cursor(siBotonClickeado(botones.iniciar) ? HAND : ARROW);
}

function dibujarPantallaFin() {
  background(22, 24, 24);
  fill(240);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(width * 0.08);
  text("Fin", width * 0.5, height * 0.3);
  textSize(width * 0.035);
  text("Gracias por explorar Mapas Circuitos", width * 0.5, height * 0.45);
  text("Creado por: manukeft", width * 0.5, height * 0.55);
  fill("limegreen");
  stroke(255);
  strokeWeight(width * 0.004);
  rect(botones.volver.x, botones.volver.y, botones.volver.w, botones.volver.h, width * 0.02);
  fill(240);
  noStroke();
  textSize(width * 0.02);
  text("Empezar de nuevo", width * 0.5, height * 0.7);
  cursor(siBotonClickeado(botones.volver) ? HAND : ARROW);
}

function dibujarMapa(temaPCB, particula, botones, sonidoSubte, sonidoParticula) {
  background(temaPCB ? "#2A3D2E" : "gray");
  noStroke();
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      fill(temaPCB ? "#2A3D2E" : "gray");
      square(i * tamCelda, j * tamCelda, tamCelda);
    }
  }

  //  líneas
  strokeWeight(width * 0.018);
  noFill();
  for (let i = 0; i < linea.length; i++) {
    stroke(temaPCB ? "#B87333" : colores[lineaColor[i]]);
    beginShape();
    for (let v of linea[i]) {
      vertex(v[0] * tamCelda + tamCelda / 2, v[1] * tamCelda + tamCelda / 2);
    }
    endShape();
  }

  //  estaciones
  for (let st of estaciones) {
    let x = st[0] * tamCelda + tamCelda / 2;
    let y = st[1] * tamCelda + tamCelda / 2;
    if (temaPCB) {
      noStroke();
      fill(0, 255, 0, 50);
      ellipse(x, y, tamCelda * 1.2);
    }
    fill(temaPCB ? "#A0A0A0" : 255);
    stroke(temaPCB ? 0 : [22, 24, 24]);
    strokeWeight(width * 0.004);
    ellipse(x, y, st[2] === 1 ? tamCelda * 0.9 : tamCelda * 0.6);
    if (st[2] === 1) ellipse(x, y, tamCelda * 0.4);
  }

  // nombre red
  noStroke();
  textAlign(CENTER, TOP);
  textSize(width * 0.035);
  let nombreRedDispo = temaPCB ? "PCB" : "Red " + nombreRed;
  let tw = textWidth(nombreRedDispo);
  fill(22, 24, 24);
  rect(width * 0.5 - tw * 0.55, height * 0.011, tw * 1.1, height * 0.05, width * 0.01);
  fill(240);
  text(nombreRedDispo, width * 0.5, height * 0.02);

  // Botones
  fill("darkred");
  stroke(0);
  strokeWeight(width * 0.004);
  rect(botones.salir.x, botones.salir.y, botones.salir.w, botones.salir.h, width * 0.01);
  fill(0);
  noStroke();
  textSize(width * 0.025);
  text("Salir", botones.salir.x + botones.salir.w / 2, botones.salir.y + botones.salir.h / 3);

  fill(temaPCB ? "#B87333" : "limegreen");
  stroke(0);
  strokeWeight(width * 0.004);
  rect(botones.tema.x, botones.tema.y, botones.tema.w, botones.tema.h, width * 0.01);
  fill(0);
  noStroke();
  textSize(width * 0.025);
  text(temaPCB ? "Tema" : "Tema", botones.tema.x + botones.tema.w / 2, botones.tema.y + botones.tema.h / 3);

  // nombre de estaciones
  let numEst = 0;
  let lineaNombre, colorLinea;
  textAlign(LEFT, TOP);
  textSize(width * 0.035);
  if (!temaPCB) {
    for (let i = 0; i < estaciones.length; i++) {
      let st = estaciones[i];
      if (mouseX > st[0] * tamCelda && mouseX < (st[0] + 1) * tamCelda &&
          mouseY > st[1] * tamCelda && mouseY < (st[1] + 1) * tamCelda) {
        fill(st[2] === 0 ? colores[lineaColor[st[3]]] : 0);
        stroke(0);
        strokeWeight(width * 0.004);
        ellipse(st[0] * tamCelda + tamCelda / 2, st[1] * tamCelda + tamCelda / 2, tamCelda * 0.9);
        noStroke();
        tw = textWidth("Estación " + nombreEstaciones[i]);
        fill(22, 24, 24);
        let tOffset = mouseX > width / 2 ? -tw * 1.15 : 0;
        rect((st[0] + 1) * tamCelda - tw * 0.03 + tOffset, st[1] * tamCelda - tamCelda * 0.2, tw * 1.06, tamCelda * 1.4, tamCelda * 0.2);
        fill(240);
        text("Estación " + nombreEstaciones[i], (st[0] + 1) * tamCelda + tOffset, st[1] * tamCelda);
        numEst++;
        lineaNombre = st[2] === 1 ? "Transbordo" : "Línea " + nombreLinea[st[3]];
        colorLinea = st[2] === 1 ? [22, 24, 24] : colores[lineaColor[st[3]]];
      }
    }
  }

  if (numEst > 0) {
    noCursor();
    textAlign(CENTER, BOTTOM);
    textSize(width * 0.035);
    tw = textWidth(lineaNombre);
    fill(colorLinea);
    rect(width * 0.5 - tw * 0.55, height * 0.989 - height * 0.05, tw * 1.1, height * 0.06, width * 0.01);
    fill(70);
    text(lineaNombre, width * 0.5, height * 0.99);
  } else if (siBotonClickeado(botones.salir) || siBotonClickeado(botones.tema)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // Dibujar destellos (solo en tema PCB)
  if (temaPCB && particula.active) {
    if (frameCount % 5 === 0) {
      destellos.push({
        x: particula.x,
        y: particula.y,
        size: random(tamCelda * 0.2, tamCelda * 0.5),
        alpha: 255,
        life: 30
      });
    }
  }

  for (let i = destellos.length - 1; i >= 0; i--) {
    let destello = destellos[i];
    fill(0, 255, 0, destello.alpha);
    noStroke();
    ellipse(destello.x, destello.y, destello.size);
    destello.alpha -= 255 / destello.life;
    destello.size += 0.5;
    if (destello.alpha <= 0) {
      destellos.splice(i, 1);
    }
  }

  // Dibujar partícula
  if (particula.active) {
    let line = linea[particula.line];
    let numSegments = line.length - 1;
    let segment = floor(particula.progress * numSegments);
    let segmentProgress = (particula.progress * numSegments) % 1;
    let x1 = line[segment][0] * tamCelda + tamCelda / 2;
    let y1 = line[segment][1] * tamCelda + tamCelda / 2;
    let x2 = line[segment + 1][0] * tamCelda + tamCelda / 2;
    let y2 = line[segment + 1][1] * tamCelda + tamCelda / 2;
    let x = lerp(x1, x2, segmentProgress);
    let y = lerp(y1, y2, segmentProgress);
    let angle = atan2(y2 - y1, x2 - x1);

    particula.x = x;
    particula.y = y;

    push();
    translate(x, y);
    rotate(angle);
    fill(temaPCB ? [0, 255, 0] : 30);
    noStroke();
    if (temaPCB) {
      ellipse(0, 0, tamCelda * 0.5);
    } else {
      rect(-tamCelda * 0.5, -tamCelda * 0.15, tamCelda * 1, tamCelda * 0.3);
    }
    pop();

    particula.progress += temaPCB ? 0.01 : particula.speed;
    if (particula.progress >= 1) {
      pararParticula(particula, temaPCB ? sonidoParticula : sonidoSubte);
    }
  }
}

function actualizarPosBot() {
  botones.iniciar = {
    x: width * 0.5 - width * 0.1,
    y: height * 0.7 - height * 0.05,
    w: width * 0.2,
    h: height * 0.1
  };
  botones.salir = {
    x: width - width * 0.12,
    y: height * 0.02,
    w: width * 0.1,
    h: height * 0.05
  };
  botones.volver = {
    x: width * 0.5 - width * 0.1,
    y: height * 0.7 - height * 0.05,
    w: width * 0.2,
    h: height * 0.1
  };
  botones.tema = {
    x: width - width * 0.12,
    y: height - height * 0.07,
    w: width * 0.1,
    h: height * 0.05
  };
}

function siBotonClickeado(button) {
  return mouseX > button.x && mouseX < button.x + button.w &&
         mouseY > button.y && mouseY < button.y + button.h;
}

function siEstacionClickeada(temaPCB, particula, sonidoSubte, sonidoParticula) {
  let estacionClickeada = false;
  for (let i = 0; i < estaciones.length; i++) {
    let st = estaciones[i];
    if (mouseX > st[0] * tamCelda && mouseX < (st[0] + 1) * tamCelda &&
        mouseY > st[1] * tamCelda && mouseY < (st[1] + 1) * tamCelda) {
      pararParticula(particula, temaPCB ? sonidoParticula : sonidoSubte);
      particula.active = true;
      particula.line = st[3];
      particula.progress = 0;
      if (temaPCB && sonidoParticula && sonidoParticula.isLoaded()) {
        sonidoParticula.play();
      } else if (!temaPCB && sonidoSubte && sonidoSubte.isLoaded()) {
        sonidoSubte.play();
      }
      estacionClickeada = true;
      break;
    }
  }
  if (!estacionClickeada) {
    reiniciarMapa();
    mostrarMapa();
  }
}

function pararParticula(particula, sound) {
  particula.active = false;
  if (sound && sound.isLoaded()) sound.stop();
}

function reiniciarMapa() {
  linea = [];
  lineaColor = [];
  estaciones = [];
  nombreEstaciones = [];
  terminales = [];
  nombreLinea = [];
  particula.active = false;
  destellos = [];
  if (sonidoSubte && sonidoSubte.isLoaded()) sonidoSubte.stop();
}