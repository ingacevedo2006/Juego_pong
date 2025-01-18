let bola;
let velocidadX = 5;
let velocidadY = 3;

let jugadorY, pcY;
const anchoRaqueta = 10;
const altoRaqueta = 80;

const margen = 20;
const velocidadRaqueta = 5;
const anchoCanvas = 800;
const altoCanvas = 400;


function setup() {
  createCanvas(anchoCanvas, altoCanvas);

  // Posiciones iniciales
  bola = createVector(width / 2, height / 2);
  jugadorY = height / 2 - altoRaqueta / 2;
  pcY = height / 2 - altoRaqueta / 2;
}


function draw() {
  background(0);

  // Dibujar la bola
  ellipse(bola.x, bola.y, 15, 15);

  // Dibujar la raqueta del jugador
  rect(margen, jugadorY, anchoRaqueta, altoRaqueta);

  // Dibujar la raqueta del PC
  rect(width - margen - anchoRaqueta, pcY, anchoRaqueta, altoRaqueta);

  // Actualizar la lógica del juego
  moverBola();
  moverRaquetaPC();
  controlarJugador();
}


function moverBola() {
  bola.x += velocidadX;
  bola.y += velocidadY;

  // Rebote en las paredes superior e inferior
  if (bola.y <= 0 || bola.y >= height) {
    velocidadY *= -1;
  }

  // Colisión con la raqueta del jugador
  if (bola.x <= margen + anchoRaqueta && bola.y >= jugadorY && bola.y <= jugadorY + altoRaqueta) {
    velocidadX *= -1;
  }

  // Colisión con la raqueta del PC
  if (bola.x >= width - margen - anchoRaqueta && bola.y >= pcY && bola.y <= pcY + altoRaqueta) {
    velocidadX *= -1;
  }

  // Reinicio si se pierde la bola
  if (bola.x < 0 || bola.x > width) {
    bola.set(width / 2, height / 2);
    velocidadX *= -1;
  }
}


function controlarJugador() {
  if (keyIsDown(UP_ARROW)) {
    jugadorY -= velocidadRaqueta;
  }
  if (keyIsDown(DOWN_ARROW)) {
    jugadorY += velocidadRaqueta;
  }

  // Limitar los movimientos de la raqueta del jugador
  jugadorY = constrain(jugadorY, 0, height - altoRaqueta);
}


function moverRaquetaPC() {
  if (bola.y > pcY + altoRaqueta / 2) {
    pcY += velocidadRaqueta;
  } else if (bola.y < pcY + altoRaqueta / 2) {
    pcY -= velocidadRaqueta;
  }

  // Limitar los movimientos de la raqueta del PC
  pcY = constrain(pcY, 0, height - altoRaqueta);
}
