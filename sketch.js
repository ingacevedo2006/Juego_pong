// Variables globales
let juegoActivo = false;
let fondoImg, bolaImg;
let nombreJugador = "";
let puntajeJugador = 0;
let puntajePC = 0;

// Tamaño de la pelota y velocidad
let pelota;
let velocidadPelota = { x: 4, y: 3 };

// Raquetas
let jugador, pc;

function preload() {
  // Carga las imágenes de fondo y pelota
  fondoImg = loadImage("fondo2.png");
  bolaImg = loadImage("bola.png");
}

function setup() {
  createCanvas(800, 400);
  // Inicializa las raquetas y pelota
  jugador = { x: 10, y: height / 2 - 50, w: 10, h: 100 };
  pc = { x: width - 20, y: height / 2 - 50, w: 10, h: 100 };
  pelota = { x: width / 2, y: height / 2, d: 20 };
  noLoop(); // El juego no inicia hasta que el usuario haga clic en "Iniciar"
}

function draw() {
  if (!juegoActivo) {
    mostrarPantallaInicial();
  } else {
    mostrarJuego();
  }
}

// Pantalla inicial
function mostrarPantallaInicial() {
  background(0); // Fondo negro
  fill(255); // Texto blanco
  textSize(32);
  textAlign(CENTER, CENTER);
  text("JUEGO PONG", width / 2, height / 4);
  textSize(20);
  text("Realizado por: Sandra", width / 2, height / 4 + 40);
  textSize(18);
  text("Por favor ingresa tu nombre para comenzar:", width / 2, height / 2 - 30);

  // Posición ajustada para el cuadro de entrada y el botón
  let yOffset = height / 2 + 10; // Desplazamiento para que quede debajo del texto
  
  
  // Cuadro de entrada para el nombre
  let input = createInput().position(width / 2 - 100, , yOffset);
  input.input(() => {
    nombreJugador = input.value();
  });

  // Botón para iniciar el juego
  let boton = createButton("Iniciar Juego").position(width / 2 - 50, yOffset + 40);
  boton.mousePressed(() => {
    if (nombreJugador.trim() !== "") {
      juegoActivo = true;
      input.remove();
      boton.remove();
      loop(); // Inicia el bucle de juego
    } else {
      alert("Por favor, ingresa tu nombre para comenzar.");
    }
  });
}

// Juego
function mostrarJuego() {
  background(fondoImg);

  // Dibujar línea divisoria
  stroke(255);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height);

  // Dibujar marcos superior e inferior
  noStroke();
  fill(200);
  rect(0, 0, width, 10); // Marco superior
  rect(0, height - 10, width, 10); // Marco inferior

  // Mostrar nombres y puntajes
  textSize(16);
  fill(255);
  textAlign(CENTER, CENTER);
  text(`${nombreJugador}: ${puntajeJugador}`, width / 4, 20);
  text(`PC: ${puntajePC}`, (3 * width) / 4, 20);

  // Dibujar raquetas
  fill(255, 0, 0); // Raqueta del jugador
  rect(jugador.x, jugador.y, jugador.w, jugador.h);
  fill(0, 0, 255); // Raqueta de la PC
  rect(pc.x, pc.y, pc.w, pc.h);

  // Dibujar pelota
  image(bolaImg, pelota.x - pelota.d / 2, pelota.y - pelota.d / 2, pelota.d, pelota.d);

  // Mover la pelota
  moverPelota();

  // Mover raqueta de la PC
  moverRaquetaPC();
}

function moverPelota() {
  pelota.x += velocidadPelota.x;
  pelota.y += velocidadPelota.y;

  // Rebote en marcos superior e inferior
  if (pelota.y - pelota.d / 2 <= 10 || pelota.y + pelota.d / 2 >= height - 10) {
    velocidadPelota.y *= -1; // Cambia la dirección vertical
  }

  // Rebote en raquetas
  if (
    pelota.x - pelota.d / 2 <= jugador.x + jugador.w &&
    pelota.y >= jugador.y &&
    pelota.y <= jugador.y + jugador.h
  ) {
    velocidadPelota.x *= -1; // Rebote en la raqueta del jugador
    velocidadPelota.x *= 1.1; // Incrementa la velocidad
    velocidadPelota.y += random(-2, 2); // Rotación aleatoria
  } else if (
    pelota.x + pelota.d / 2 >= pc.x &&
    pelota.y >= pc.y &&
    pelota.y <= pc.y + pc.h
  ) {
    velocidadPelota.x *= -1; // Rebote en la raqueta de la PC
    velocidadPelota.x *= 1.1; // Incrementa la velocidad
    velocidadPelota.y += random(-2, 2); // Rotación aleatoria
  }

  // Anotación
  if (pelota.x < 0) {
    puntajePC++;
    reiniciarPelota();
    narrarGol("¡Punto para el PC!");
  } else if (pelota.x > width) {
    puntajeJugador++;
    reiniciarPelota();
    narrarGol(`¡Punto para ${nombreJugador}!`);
  }
}

function moverRaquetaPC() {
  if (pelota.y < pc.y + pc.h / 2) {
    pc.y -= 3; // La raqueta del PC sube
  } else if (pelota.y > pc.y + pc.h / 2) {
    pc.y += 3; // La raqueta del PC baja
  }
}

function reiniciarPelota() {
  pelota.x = width / 2;
  pelota.y = height / 2;
  velocidadPelota.x = random([-4, 4]);
  velocidadPelota.y = random([-3, 3]);
}

// Control de raqueta del jugador
function keyPressed() {
  if (key === "ArrowUp" && jugador.y > 10) {
    jugador.y -= 10;
  } else if (key === "ArrowDown" && jugador.y < height - jugador.h - 10) {
    jugador.y += 10;
  }
}

// Narrar gol con síntesis de voz
function narrarGol(mensaje) {
  let narrador = new SpeechSynthesisUtterance(mensaje);
  narrador.lang = "es-ES";
  window.speechSynthesis.speak(narrador);
}

