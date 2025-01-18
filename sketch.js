let jugadorNombre = "Jugador";
let jugadorColor = "#3498db";
let pcColor = "#e74c3c";

let pelota;
let jugador;
let pc;
let jugadorPuntaje = 0;
let pcPuntaje = 0;
let juegoActivo = false;

function setup() {
  // Crear el canvas y ocultarlo inicialmente
  let canvas = createCanvas(800, 400);
  canvas.parent("panel-juego");
  noLoop(); // El juego no iniciará hasta que el jugador haga clic en "Iniciar Juego"

  // Crear la pelota
  pelota = {
    x: width / 2,
    y: height / 2,
    r: 10,
    vx: 5,
    vy: 5,
  };

  // Crear la raqueta del jugador
  jugador = {
    x: 20,
    y: height / 2 - 50,
    w: 10,
    h: 100,
  };

  // Crear la raqueta del PC
  pc = {
    x: width - 30,
    y: height / 2 - 50,
    w: 10,
    h: 100,
  };
}

function draw() {
  background(30);

  if (juegoActivo) {
    // Dibujar la pelota
    fill(255);
    ellipse(pelota.x, pelota.y, pelota.r * 2);

    // Mover la pelota
    pelota.x += pelota.vx;
    pelota.y += pelota.vy;

    // Rebotar en las paredes
    if (pelota.y <= 0 || pelota.y >= height) pelota.vy *= -1;

    // Colisión con el jugador
    if (
      pelota.x - pelota.r < jugador.x + jugador.w &&
      pelota.y > jugador.y &&
      pelota.y < jugador.y + jugador.h
    ) {
      pelota.vx *= -1;
      pelota.x = jugador.x + jugador.w + pelota.r;
    }

    // Colisión con el PC
    if (
      pelota.x + pelota.r > pc.x &&
      pelota.y > pc.y &&
      pelota.y < pc.y + pc.h
    ) {
      pelota.vx *= -1;
      pelota.x = pc.x - pelota.r;
    }

    // Fuera de la pantalla: Puntaje
    if (pelota.x < 0) {
      pcPuntaje++;
      resetPelota();
    } else if (pelota.x > width) {
      jugadorPuntaje++;
      resetPelota();
    }

    // Dibujar las raquetas
    fill(jugadorColor);
    rect(jugador.x, jugador.y, jugador.w, jugador.h);

    fill(pcColor);
    rect(pc.x, pc.y, pc.w, pc.h);

    // Movimiento del jugador (con el mouse)
    jugador.y = constrain(mouseY - jugador.h / 2, 0, height - jugador.h);

    // Movimiento del PC (automático)
    pc.y = constrain(pelota.y - pc.h / 2, 0, height - pc.h);

    // Actualizar el puntaje
    updateScore();
  }
}

function resetPelota() {
  pelota.x = width / 2;
  pelota.y = height / 2;
  pelota.vx *= -1; // Cambiar dirección de la pelota
}

function updateScore() {
  document.getElementById("score").innerText = `Puntaje: ${jugadorPuntaje} - ${pcPuntaje}`;
}

function iniciarJuego() {
  const inputNombre = document.getElementById("nombre-jugador").value;
  if (inputNombre.trim() === "") {
    alert("Por favor, ingresa tu nombre antes de comenzar.");
    return;
  }

  // Asignar el nombre del jugador y mostrar el panel de juego
  jugadorNombre = inputNombre;
  document.getElementById("pantalla-inicial").style.display = "none";
  document.getElementById("panel-juego").style.display = "flex";

  // Iniciar el juego
  juegoActivo = true;
  loop(); // Activar el bucle del juego
}

function togglePause() {
  juegoActivo = !juegoActivo;
  if (juegoActivo) {
    loop();
    document.getElementById("pauseButton").innerText = "Pausar";
  } else {
    noLoop();
    document.getElementById("pauseButton").innerText = "Reanudar";
  }
}
