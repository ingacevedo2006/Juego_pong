let jugadorNombre = "Jugador";
let jugadorColor = "#3498db";
let pcColor = "#e74c3c";

let pelota;
let jugador;
let pc;
let jugadorPuntaje = 0;
let pcPuntaje = 0;
let juegoActivo = false;
let anguloPelota = 0;

let fondoImg; // Imagen de fondo
let bolaImg;  // Imagen de la pelota

function preload() {
  fondoImg = loadImage("fondo2.png");
  bolaImg = loadImage("bola.png");
}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");
  noLoop();

  pelota = { x: width / 2, y: height / 2, r: 10, vx: 5, vy: 5, velocidad: 5 };

  jugador = { x: 20, y: height / 2 - 50, w: 10, h: 100 };
  pc = { x: width - 30, y: height / 2 - 50, w: 10, h: 100 };
}

function draw() {
  // Dibuja el fondo (imagen o color alternativo)
  if (fondoImg) {
    background(fondoImg);
  } else {
    background(0); // Negro si no se encuentra la imagen
  }

  // Dibujar marcos
  stroke(255);
  strokeWeight(5);
  line(0, 0, width, 0); // Marco superior
  line(0, height, width, height); // Marco inferior

  // Dibujar línea divisoria
  strokeWeight(2);
  line(width / 2, 0, width / 2, height);

  // Dibujar nombres y puntajes
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(`${jugadorNombre}: ${jugadorPuntaje}`, width / 4, 20);
  text(`PC: ${pcPuntaje}`, (3 * width) / 4, 20);

  // Solo dibujar elementos del juego si está activo
  if (juegoActivo) {
    // Pelota con rotación
    push();
    translate(pelota.x, pelota.y);
    rotate(radians(anguloPelota));
    if (bolaImg) {
      image(bolaImg, -pelota.r, -pelota.r, pelota.r * 2, pelota.r * 2);
    } else {
      fill(255, 0, 0);
      ellipse(0, 0, pelota.r * 2);
    }
    pop();

    // Actualización de la pelota y las colisiones
    pelota.x += pelota.vx;
    pelota.y += pelota.vy;

    if (pelota.y <= 0 || pelota.y >= height) {
      pelota.vy *= -1;
      anguloPelota += 45;
    }

    if (
      pelota.x - pelota.r < jugador.x + jugador.w &&
      pelota.y > jugador.y &&
      pelota.y < jugador.y + jugador.h
    ) {
      pelota.vx *= -1.1;
      anguloPelota += 45;
    }

    if (
      pelota.x + pelota.r > pc.x &&
      pelota.y > pc.y &&
      pelota.y < pc.y + pc.h
    ) {
      pelota.vx *= -1.1;
      anguloPelota += 45;
    }

    // Verificar goles
    if (pelota.x < 0) {
      pcPuntaje++;
      narrarGol("Gol del PC");
      resetPelota();
    } else if (pelota.x > width) {
      jugadorPuntaje++;
      narrarGol(`Gol de ${jugadorNombre}`);
      resetPelota();
    }

    // Dibuja las raquetas
    fill(jugadorColor);
    rect(jugador.x, jugador.y, jugador.w, jugador.h);

    fill(pcColor);
    rect(pc.x, pc.y, pc.w, pc.h);

    // Movimiento del jugador y PC
    jugador.y = constrain(mouseY - jugador.h / 2, 0, height - jugador.h);
    pc.y = constrain(pelota.y - pc.h / 2, 0, height - pc.h);
  }
}


function resetPelota() {
  pelota.x = width / 2;
  pelota.y = height / 2;
  pelota.vx = random([-5, 5]);
  pelota.vy = random([-3, 3]);
}

function iniciarJuego() {
  const inputNombre = document.getElementById("nombre-jugador").value;
  if (inputNombre.trim() === "") {
    alert("Por favor, ingresa tu nombre antes de comenzar.");
    return;
  }
  jugadorNombre = inputNombre;
  document.getElementById("pantalla-inicial").style.display = "none";
  document.getElementById("panel-juego").style.display = "flex";
  juegoActivo = true;
  loop();
}

function togglePause() {
  juegoActivo = !juegoActivo;
  if (juegoActivo) {
    loop();
  } else {
    noLoop();
  }
}

function narrarGol(texto) {
  let mensaje = new SpeechSynthesisUtterance(texto);
  mensaje.lang = "es-ES";
  speechSynthesis.speak(mensaje);
}

