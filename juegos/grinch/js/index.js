//--------------------
// AUDIO
//--------------------
const btnStart = document.getElementById('start');
document.addEventListener("DOMContentLoaded", function() {
    const btnAudio = document.getElementById('audiobtn');
    let audioGlobal = document.getElementById('audioGlobalDom');
    let reproduciendo = false;
    // Función para controlar el audio (play/pause) y cambio de imagen
    function toggleAudio() {
        if (btnAudio.classList.contains("audioActive")) {
            audioGlobal.pause();
            btnAudio.classList.remove("audioActive");
        } else {
            audioGlobal.play();
            btnAudio.classList.add("audioActive");
        }
    }
    btnAudio.addEventListener('click', () => {
        toggleAudio();
    });
    btnStart.addEventListener('click', () => {
        toggleAudio();
    });
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            reproduciendo = !audioGlobal.paused;
            if (reproduciendo) {
                audioGlobal.pause();
                btnAudio.classList.remove("audioActive");
            }
        } else {
            if (reproduciendo) {
                audioGlobal.play();
                btnAudio.classList.add("audioActive");
            }
        }
    });
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

//-----------------
// SCRIPT DEL JUEGO
//-----------------
let score = 10;
document.addEventListener('DOMContentLoaded', function () {
    const grinchItems = document.querySelectorAll('.grinch');
    const toyItems = document.querySelectorAll('.toy');
    const modalEnd = document.getElementById("modalEnd");
    const startBtn = document.getElementById("start");
    let grinchClicked = false;
    let toyClicked = false;
    let timeoutHandle;
    let gameStarted = false;
    // Función para mostrar los personajes
    function showCharacters() {
        const randomGrinchIndex = Math.floor(Math.random() * grinchItems.length);
        const randomToyIndex = Math.floor(Math.random() * toyItems.length);
        if (Math.random() > 0.5) {
            grinchItems[randomGrinchIndex].classList.add('grinchActive');
        } else {
            toyItems[randomToyIndex].classList.add('toyActive');
        }
        setTimeout(hideCharacters, 1250);
    }
    // Función para ocultar los personajes
    function hideCharacters() {
        grinchItems.forEach(item => {
            item.classList.remove('grinchActive');
            item.classList.remove('grinchActiveAfter');
        });
        toyItems.forEach(item => {
            item.classList.remove('toyActive');
            item.classList.remove('toyActiveAfter');
        });
        grinchClicked = false;
        toyClicked = false;
        // Resetea estado de clic en los botones
        document.querySelectorAll('.botasItem').forEach(btn => {
            btn.removeAttribute('data-clicked');
        });
    }
    let btns = document.querySelectorAll('.botasItem');
    // Configuración del temporizador
    btns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            if (!gameStarted) return;
            // Evitar múltiples clics en el mismo botón durante la ronda
            if (btn.getAttribute('data-clicked') === 'true') return;
            btn.setAttribute('data-clicked', 'true');
            event.stopImmediatePropagation();
            if (btn.querySelector('.grinch')?.classList.contains('grinchActive')) {
                score--;
                document.getElementById('counter').innerText = `x ${score}`;
                btn.querySelector('.grinchActive').classList.add('grinchActiveAfter');
                if (score === 0) {
                    clearTimeout(timeoutHandle);
                    modalEnd.style.display = 'block';
                }
            }
            if (btn.querySelector('.toy')?.classList.contains('toyActive')) {
                score++;
                document.getElementById('counter').innerText = `x ${score}`;
                btn.querySelector('.toyActive').classList.add('toyActiveAfter');
            }
        });
    });
    const timerElement = document.getElementById('timer');
    let minutes = 1;
    let seconds = 0;
    // Función de cuenta regresiva
    function countdown() {
        function tick() {
            timerElement.innerHTML = "Tiempo " + minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
            seconds--;
            if (seconds < 0) {
                if (minutes === 0) {
                    clearTimeout(timeoutHandle);
                    if (score === 0) {
                        modalEnd.style.display = 'flex';
                    } else {
                        modalEnd.style.display = 'flex';
                    }
                } else {
                    minutes--;
                    seconds = 59;
                }
            }
            timeoutHandle = setTimeout(tick, 1000);
        }
        tick();
    }
    // Inicia el juego solo cuando se hace clic en el anchor
    startBtn.addEventListener('click', function() {
        gameStarted = true;  // Marca que el juego ha comenzado
        countdown();  // Inicia el temporizador
        const gameTimer = setInterval(() => {
            showCharacters();
        }, 1500);
    });
});

//--------------------
// RANKINKG
//--------------------
if (document.getElementById('modalEnd')){
    document.addEventListener("DOMContentLoaded", function() {
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
                if ((selectedRating >= 4) && (score === 0)) {
                    // Si calificó con 4 ó 5 y ganó:
                    pergamino1.style.display = "none";
                    pergaminoBien.style.display = "flex";
                    audioBien.play();  // Audio pergaminoBien
                } else if ((selectedRating >= 4) && (score > 0)) {
                    // Si calificó con 4 o 5, y perdió:
                    pergamino1.style.display = "none";
                    pergaminoMal.style.display = "flex";
                    audioMal.play();  // Audio pergaminoMal
                } else if (selectedRating <= 3 ) {
                    // Si calificó con 3 o menos:
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
            if ( (!btnContinueRank2.classList.contains('btnOff')) && (score === 0) ) {
                // Si el textarea tiene información, y ganó:
                pergamino1.style.display = "none";
                pergaminoBien.style.display = "flex";
                audioBien.play();  // Audio pergaminoBien
            } else if ( (!btnContinueRank2.classList.contains('btnOff')) && (score > 0) ) {
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
    });
}