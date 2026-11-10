//--------------------
// ESTRELLAS DE FONDO
//--------------------
if (document.getElementById('stars')){
    function stars() {
        const count = 300;
        const stars = document.getElementById('stars');
        var i = 0;
        while(i < count) {
        const star = document.createElement('i');
            const x = Math.floor(Math.random() * window.innerWidth)
            const y = Math.floor(Math.random() * window.innerHeight)
            const size = Math.random() * 4;
            star.style.left = x+'px';
            star.style.top = y+'px';
            star.style.height = 1+size+'px';
            star.style.width = 1+size+'px';
            const duration = Math.random() * 2;
            star.style.animationDuration = 2+duration+'s';
            stars.appendChild(star);
            i++
        }
    }
    stars();
}


//--------------------
// JUEGO
//--------------------

const lanes = document.querySelectorAll(".lane");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restartBtn");
const gameArea = document.getElementById("game");
const healthContainer = document.getElementById("health-container");
const healthBar = document.getElementById("health-bar");
const audio = document.getElementById("audioGlobalDom");
const modalEnd = document.getElementById("modalEnd");

let score = 0;
let isPlaying = false;
let arrowInterval;
let fallSpeed = 3;
let gameResult = null;
const keys = ["a", "s", "d", "f"];
let lastKeyIndex = 0;
let health = 100;

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) return;
        func.apply(this, args);
        timeoutId = setTimeout(() => {
            timeoutId = null;
        }, delay);
    };
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function nextKeyIndices() {
    let move = Math.random() < 0.5 ? -1 : 1;
    let nextIndex = lastKeyIndex + move;
    if (nextIndex < 0) nextIndex = 1;
    if (nextIndex > keys.length - 1) nextIndex = keys.length - 2;
    return [lastKeyIndex, nextIndex];
}

function generateNextPattern() {
    let pattern = [];
    const twoKeys = Math.random() < 0.3;
    if (twoKeys && isTouchDevice()) {
        const [i1, i2] = nextKeyIndices();
        lastKeyIndex = i2;
        pattern.push(keys[i1], keys[i2]);
    } else {
        const [i1, i2] = nextKeyIndices();
        const chosenIndex = Math.random() < 0.5 ? i1 : i2;
        lastKeyIndex = chosenIndex;
        pattern.push(keys[chosenIndex]);
    }
    return pattern;
}

function spawnArrows(keys) {
    keys.forEach(key => {
        const lane = [...lanes].find(l => l.dataset.key === key);
        if (!lane) return;
        const arrow = document.createElement("div");
        arrow.classList.add("arrow");
        arrow.dataset.key = key;
        if (Math.random() < 0.2) {
            arrow.classList.add("special");
        }
        let posY = -40;
        arrow.style.top = posY + "px";
        lane.appendChild(arrow);
        const fall = setInterval(() => {
            if (!isPlaying) {
                clearInterval(fall);
                arrow.remove();
                return;
            }
            posY += fallSpeed;
            arrow.style.top = posY + "px";
            arrow.dataset.top = posY;
            if (posY > 500) {
                clearInterval(fall);
                score -= 10;
                scoreDisplay.textContent = "Puntos: " + score;
                updateHealth(-2);
                arrow.classList.add("slide-out-blurred-bottom");
                checkGameEnd();
                return;
            }
        }, 16);
    });
}

function playPattern() {
    arrowInterval = setInterval(() => {
        const pattern = generateNextPattern();
        spawnArrows(pattern);
    }, 600);
}

function flashLane(key) {
    const lane = [...lanes].find(l => l.dataset.key === key);
    const flash = lane.querySelector(".flash");
    flash.classList.add("active");
    setTimeout(() => flash.classList.remove("active"), 200);
}

function updateHealth(amount) {
    health += amount;
    if (health > 100) health = 100;
    if (health < 0) health = 0;
    healthBar.style.width = health + "%";
    checkGameEnd();
}

function checkGameEnd() {
    if (gameResult !== null) return;
    if (score >= 5000) {
        gameResult = "win";
        endGame("¡Ganaste! Llegaste a 10,000 puntos.");
    } else if (score <= 0 || health <= 0) {
        gameResult = "lose";
        endGame("¡Perdiste! Tu puntuación llegó a cero.");
    }
}

function endGame(message) {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(arrowInterval);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    if (modalEnd) {
        modalEnd.style.display = "flex";
    }
}

lanes.forEach(lane => {
    const key = lane.dataset.key;
    const handleInteraction = () => {
    if (!isPlaying) return;
    flashLane(key);
    const hitbox = lane.querySelector(".hitbox");
    const hitboxRect = hitbox.getBoundingClientRect();
    const arrows = [...lane.querySelectorAll(".arrow")];
    let hit = false;
    let arrowsInHitbox = 0;
    for (let arrow of arrows) {
        const arrowRect = arrow.getBoundingClientRect();
        const overlap = !(arrowRect.bottom < hitboxRect.top || arrowRect.top > hitboxRect.bottom);
        if (overlap) {
            arrowsInHitbox++;
            arrow.remove();
            score += 100;
            scoreDisplay.textContent = "Puntos: " + score;
            updateHealth(5);
            hit = true;
            break;
        }
    }
    // Penaliza solo si había flechas en el hitbox y no se acertó
    if (!hit && arrowsInHitbox > 0) {
        score -= 50;
        scoreDisplay.textContent = "Puntos: " + score;
        updateHealth(-10);
    }
};

    const debouncedInteraction = debounce(handleInteraction, 300);
    // lane.addEventListener("click", debouncedInteraction);
    // lane.addEventListener("touchstart", debouncedInteraction, { passive: true });
    // Touch para móviles
    if (isTouchDevice()) {
        lane.addEventListener("touchstart", debouncedInteraction, { passive: true });
    } 
    // Click para desktop
    else {
        lane.addEventListener("click", debouncedInteraction);
    }
});

function startGame() {
    isPlaying = true;
    score = 0;
    health = 100;
    lastKeyIndex = 0;
    fallSpeed = 3;
    gameResult = null;
    scoreDisplay.textContent = "Puntos: 0";
    healthBar.style.width = "100%";
    gameArea.classList.remove("hidden");
    scoreDisplay.classList.remove("hidden");
    healthContainer.classList.remove("hidden");
    startBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
    playPattern();
}

function restartGame() {
    isPlaying = false;
    clearInterval(arrowInterval);
    document.querySelectorAll(".arrow").forEach(arrow => arrow.remove());
    score = 0;
    health = 100;
    lastKeyIndex = 0;
    fallSpeed = 3;
    gameResult = null;
    scoreDisplay.textContent = "Puntos: 0";
    healthBar.style.width = "100%";
    startBtn.classList.remove("hidden");
    restartBtn.classList.add("hidden");
    gameArea.classList.add("hidden");
    scoreDisplay.classList.add("hidden");
    healthContainer.classList.add("hidden");
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);













//--------------------
// RANKINKG
//--------------------
document.addEventListener("DOMContentLoaded", function(){
    if (document.getElementById('modalEnd')){
        const starInputs = document.querySelectorAll('input[name="star"]');
        const btnContinue = document.querySelector(".pergaminoRank .btnOff");
        const pergamino1 = document.getElementById("pergamino1");
        const pergaminoBien = document.getElementById("pergaminoBien");
        const pergaminoMal = document.getElementById("pergaminoMal");
        const audioBien = new Audio('img/audioPergaminoBien.mp3');
        const audioMal = new Audio('img/audioPergaminoMal.mp3');
        const audioAdorno = new Audio('img/audioAdorno.wav');
        const pergaminoFinal = document.getElementById("pergaminoFinal");
        const rank1 = document.getElementById("rank1");
        const rank2 = document.getElementById("rank2");
        const textarea = document.getElementById("dislike");
        const back = document.getElementById("back");
        const playAgain = document.querySelectorAll('.playAgain');
        const ratingAlert = document.querySelector('.ratingAlert');
        let selectedRating = 0;
        // 1. Escucha para calificar con estrellas
        starInputs.forEach(star => {
            star.addEventListener('change', function() {
                selectedRating = parseInt(this.id.replace("star", ""), 10);
                if ((selectedRating >= 4) && (gameResult === "win")) {
                    console.log(selectedRating)
                    // Si calificó con 4 ó 5 y ganó:
                    pergamino1.style.display = "none";
                    pergaminoBien.style.display = "flex";
                    audioBien.play();  // Audio pergaminoBien
                } else if ((selectedRating >= 4) && (gameResult === "lose")) {
                    // Si calificó con 4 o 5, y perdió:
                    pergamino1.style.display = "none";
                    pergaminoMal.style.display = "flex";
                    audioMal.play();  // Audio pergaminoMal
                } else if (selectedRating <= 3 ) {
                    // Si la calificación es 3 o menos, ocultar Rank1 y mostrar Rank2
                    rank1.style.display = "none";
                    rank2.style.display = "flex";
                    // Añadir la clase correspondiente al párrafo .pergaminoSubtitle
                    const pergaminoSubtitle = rank2.querySelector(".pergaminoSubtitle");
                    pergaminoSubtitle.classList.add(`star${selectedRating}`);
                }
            });
        });
        // 2. Validar acción del botón "Continuar" en Rank1
        btnContinue.addEventListener('click', function() {
            if (selectedRating === 0) {
                ratingAlert.style.display = "block";
                return;
            }
        });
        // 4. Validar textarea en rank2
        const btnContinueRank2 = rank2.querySelector(".btnOff");
        textarea.addEventListener('input', function() {
            if (textarea.value.trim().length > 0) {
                // Si el textarea tiene información, activar botón
                btnContinueRank2.classList.remove('btnOff');
                btnContinueRank2.classList.add('btnYellow');
            } else {
                // Si el textarea está vacío, desactivar botón
                btnContinueRank2.classList.add('btnOff');
                btnContinueRank2.classList.remove('btnYellow');
            }
        });
        // 5. Validar acción del botón "Continuar" en Rank2
        btnContinueRank2.addEventListener('click', function() {
            if ( (!btnContinueRank2.classList.contains('btnOff')) && (gameResult === "win") ) {
                // Si el textarea tiene información, y ganó:
                pergamino1.style.display = "none";
                pergaminoBien.style.display = "flex";
                audioBien.play();  // Audio pergaminoBien
            } else if ( (!btnContinueRank2.classList.contains('btnOff')) && (gameResult === "lose") ) {
                // Si el textarea tiene informacióny perdió:
                pergamino1.style.display = "none";
                pergaminoMal.style.display = "flex";
                audioMal.play();  // Audio pergaminoMal
            }
        });
        // 6. Botón "Regresar" en Rank2
        back.addEventListener('click', function() {
            // Limpiar textarea
            textarea.value = "";
            btnContinueRank2.classList.add('btnOff');
            btnContinueRank2.classList.remove('btnYellow');
            // Ocultar Rank2 y mostrar Rank1
            rank2.style.display = "none";
            rank1.style.display = "flex";
            // Reiniciar selección de estrellas
            starInputs.forEach(star => {
                star.checked = false;
            });
            // Reiniciar botón continuar en Rank1
            btnContinue.classList.add('btnOff');
            btnContinue.classList.remove('btnYellow');
            // Reiniciar pergaminoSubtitle en Rank2
            const pergaminoSubtitle = rank2.querySelector(".pergaminoSubtitle");
            pergaminoSubtitle.classList.remove(`star${selectedRating}`);
            // Reiniciar la calificación seleccionada
            selectedRating = 0;
        });
        // 7. Boton en pergaminoBien
        const btnContinue2 = pergaminoBien.querySelector(".btnYellow");
        btnContinue2.addEventListener('click', function() {
            pergaminoBien.style.display = "none";
            pergaminoFinal.style.display = "flex";
            audioBien.pause();
            audioBien.currentTime = 0;
            audioAdorno.play();  // Audio adorno
        });
        // 8. Boton en pergaminoMal
        const btnContinue3 = pergaminoMal.querySelector(".btnYellow");
        btnContinue3.addEventListener('click', function() {
            pergaminoMal.style.display = "none";
            pergaminoFinal.style.display = "flex";
            audioMal.pause();
            audioMal.currentTime = 0;
            audioAdorno.play();  // Audio adorno
        });
        // 9. Botones playAgain para recargar el documento
        playAgain.forEach(button => {
            button.addEventListener('click', function() {
                location.reload();
            });
        });
    }
});


//--------------------
// MODAL BOX
//--------------------
if (document.getElementsByClassName('modal')){
    var btn = document.querySelectorAll("a.modalButton");
    var modals = document.querySelectorAll('.modal');
    var spans = document.getElementsByClassName("close");
    // Apertura (anchor .modalButton)
    for (var i = 0; i < btn.length; i++) {
        btn[i].onclick = function(e) {
            e.preventDefault();
            modal = document.querySelector(e.target.getAttribute("href"));
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            document.body.style.height = "100%";
        }
    }
    // Cierre (anchor .close)
    for (var i = 0; i < spans.length; i++) {
        spans[i].onclick = function() {
            for (var index in modals) {
                if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";
                document.body.style.overflow = "auto";
                document.body.style.height = "auto";
            }
        }
    }
}