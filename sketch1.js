let anchoCanvas = 800;
let altoCanvas = 400;

let jugadorX = 15;
let jugadorY;
let anchoRaqueta = 10;
let altoRaqueta = 100;

let computadoraX = anchoCanvas - 25;
let computadoraY;

let pelotaX, pelotaY;
let diametroPelota = 20;
let velocidadPelotaX = 5;
let velocidadPelotaY = 5;
let anguloPelota = 0;

let grosorMarco = 10;

let jugadorScore = 0;
let computadoraScore = 0;

let fondo;
let barraJugador;
let barraComputadora;
let bola;
let sonidoRebote;
let sonidoGol;

// Historial de partidos
let historialPartidos = [];

function preload() {
    fondo = loadImage('fondo1.png');
    barraJugador = loadImage('barra1.png');
    barraComputadora = loadImage('barra2.png');
    bola = loadImage('bola.png');
    sonidoRebote = loadSound('woosh-230554.mp3');
    sonidoGol = loadSound('cancel-36118.mp3');
}

function setup() {
    createCanvas(anchoCanvas, altoCanvas);
    jugadorY = height / 2 - altoRaqueta / 2;
    computadoraY = height / 2 - altoRaqueta / 2;
    resetPelota();
    // Crear el botón de reinicio
    let botonReinicio = createButton('Nuevo Juego');
    botonReinicio.position(width / 2 - 50, height / 2 + 50);
    botonReinicio.mousePressed(reiniciarJuego);
    botonReinicio.hide(); // Se oculta el botón al principio
}

function draw() {
    background(fondo);
    dibujarMarcos();
    dibujarRaquetas();
    dibujarPelota();
    mostrarPuntaje();
    moverPelota();
    moverComputadora();
    verificarColisiones();
}

function dibujarMarcos() {
    fill(color("#2B3FD6"));
    rect(0, 0, width, grosorMarco); // Marco superior
    rect(0, height - grosorMarco, width, grosorMarco); // Marco inferior
}

function dibujarRaquetas() {
    image(barraJugador, jugadorX, jugadorY, anchoRaqueta, altoRaqueta);
    image(barraComputadora, computadoraX, computadoraY, anchoRaqueta, altoRaqueta);
}

function dibujarPelota() {
    push();
    translate(pelotaX, pelotaY);
    rotate(anguloPelota);
    imageMode(CENTER);
    image(bola, 0, 0, diametroPelota, diametroPelota);
    pop();
}

function mostrarPuntaje() {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(color("#2B3FD6"));
    text(jugadorScore, width / 4, grosorMarco * 3);
    text(computadoraScore, 3 * width / 4, grosorMarco * 3);
}

function moverPelota() {
    pelotaX += velocidadPelotaX;
    pelotaY += velocidadPelotaY;

    // Ajustar el ángulo de la pelota en función de su velocidad
    let velocidadTotal = sqrt(velocidadPelotaX * velocidadPelotaX + velocidadPelotaY * velocidadPelotaY);
    anguloPelota += velocidadTotal * 0.05;

    // Colisión con el marco superior e inferior
    if (pelotaY - diametroPelota / 2 < grosorMarco || 
        pelotaY + diametroPelota / 2 > height - grosorMarco) {
        velocidadPelotaY *= -1;
    }
}

function moverComputadora() {
    if (pelotaY > computadoraY + altoRaqueta / 2) {
        computadoraY += 4;
    } else if (pelotaY < computadoraY + altoRaqueta / 2) {
        computadoraY -= 4;
    }
    computadoraY = constrain(computadoraY, grosorMarco, height - grosorMarco - altoRaqueta);
}

function verificarColisiones() {
    // Colisión con los bordes izquierdo y derecho (anotación y reinicio)
    if (pelotaX < 0) {
        computadoraScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        if (computadoraScore >= 3) {
            mostrarMensajeFinal("¡Computadora ha ganado!");
            noLoop(); // Detener el juego
            historialPartidos.push({jugador: jugadorScore, computadora: computadoraScore}); // Guardar el partido
            mostrarHistorial();
        } else {
            resetPelota();
        }
    } else if (pelotaX > width) {
        jugadorScore++;
        sonidoGol.play(); // Reproducir sonido de gol
        narrarMarcador(); // Narrar marcador
        if (jugadorScore >= 3) {
            mostrarMensajeFinal("¡Jugador ha ganado!");
            noLoop(); // Detener el juego
            historialPartidos.push({jugador: jugadorScore, computadora: computadoraScore}); // Guardar el partido
            mostrarHistorial();
        } else {
            resetPelota();
        }
    }
}

function mostrarMensajeFinal(texto) {
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0); // Color rojo
    text(texto, width / 2, height / 2);
}

function narrarMarcador() {
    let narrador = new SpeechSynthesisUtterance(`El marcador es ${jugadorScore} a ${computadoraScore}`);
    window.speechSynthesis.speak(narrador);
}

function resetPelota() {
    pelotaX = width / 2;
    pelotaY = height / 2;
    velocidadPelotaX = 5 * (Math.random() > 0.5 ? 1 : -1);
    velocidadPelotaY = 5 * (Math.random() > 0.5 ? 1 : -1);
    anguloPelota = 0;
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        jugadorY -= 50;
    } else if (keyCode === DOWN_ARROW) {
        jugadorY += 50;
    }
    jugadorY = constrain(jugadorY, grosorMarco, height - grosorMarco - altoRaqueta);
}

// Función para reiniciar el juego
function reiniciarJuego() {
    jugadorScore = 0;
    computadoraScore = 0;
    resetPelota();
    loop(); // Reanudar el ciclo del juego
    // Volver a ocultar el botón
    select('button').hide();
}

// Mostrar historial de partidos
function mostrarHistorial() {
    let historial = 'Historial de Partidos:\n';
    historialPartidos.forEach((partido, index) => {
        historial += `Partido ${index + 1}: Jugador ${partido.jugador} - Computadora ${partido.computadora}\n`;
    });
    alert(historial); // Mostrar en un cuadro de alerta, puedes personalizar la presentación
}
