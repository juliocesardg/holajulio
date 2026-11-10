//--------------------
// REDIMENSIONAMIENTO
//--------------------
function adjustGameContainerHeight() {
    setTimeout(() => {
        const windowHeight = window.innerHeight;
        const gameContainer = document.querySelector('.gameContainer');
        gameContainer.style.height = `${windowHeight}px`;
    }, 50); // Ajustar el tiempo si es necesario
}
// Ejecutar ajuste cuando se carga la página o cuando cambia el tamaño de la ventana
window.addEventListener('load', adjustGameContainerHeight);
window.addEventListener('resize', adjustGameContainerHeight);
//--------------------
// AUDIO
//--------------------
document.addEventListener("DOMContentLoaded", function() {
    const btnAudio = document.getElementById('audiobtn');
    const btnStart = document.getElementById('start');
    let audioGlobal = document.getElementById('audioGlobalDom');
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


//--------------------
// JUEGO
//--------------------
const scoreElement = document.getElementById('score');
let score = 0;
document.addEventListener("DOMContentLoaded", function(){
    if (document.getElementById('game')) {
        const gameContainer = document.querySelector('.gameContainer');
        const sombrero = document.querySelector('.sombrero');
        const timerElement = document.getElementById('timer');
        const soundTrue = new Audio('img/sound-true.mp3');
        const soundFalse = new Audio('img/sound-false.mp3');
        let gameDuration = 60; // 60 segundos
        let gameInterval;
        let itemFallInterval;
        let gameRunning = false;
        let sombreroX = 0;
        // Posicionamiento inicial del sombrero (parte inferior, al centro)
        sombrero.style.position = 'absolute';
        sombrero.style.bottom = '0px';  // Siempre en la parte inferior
        sombrero.style.left = `${(gameContainer.offsetWidth - sombrero.offsetWidth) / 2}px`; // Centrado inicialmente
        // Movimiento del sombrero con el mouse
        gameContainer.addEventListener('mousemove', (e) => {
            if (!gameRunning) return;
            let containerRect = gameContainer.getBoundingClientRect();
            let sombreroWidth = sombrero.offsetWidth;
            sombreroX = e.clientX - containerRect.left - sombreroWidth / 2;
            if (sombreroX < 0) sombreroX = 0;
            if (sombreroX + sombreroWidth > containerRect.width) {
                sombreroX = containerRect.width - sombreroWidth;
            }
            sombrero.style.left = `${sombreroX}px`;
        });
        // Para touch en dispositivos móviles
        gameContainer.addEventListener('touchmove', (e) => {
            if (!gameRunning) return;
            let containerRect = gameContainer.getBoundingClientRect();
            let sombreroWidth = sombrero.offsetWidth;
            sombreroX = e.touches[0].clientX - containerRect.left - sombreroWidth / 2;
            if (sombreroX < 0) sombreroX = 0;
            if (sombreroX + sombreroWidth > containerRect.width) {
                sombreroX = containerRect.width - sombreroWidth;
            }
            sombrero.style.left = `${sombreroX}px`;
        });
        // Iniciar el juego al hacer clic en #start
        document.getElementById('start').addEventListener('click', () => {
            resetGame();
            startGame();
        });
        function startGame() {
            gameRunning = true;
            let timeLeft = gameDuration;
            updateTimer(timeLeft);
            gameInterval = setInterval(() => {
                timeLeft--;
                updateTimer(timeLeft);
                if (timeLeft <= 0) {
                    endGame();
                }
            }, 1000);
            // Crear items que caen cada 1 segundo
            itemFallInterval = setInterval(createFallingItem, 1000);
        }
        // Califica y termina el juego
        function endGame() {
            clearInterval(gameInterval);
            clearInterval(itemFallInterval);
            gameRunning = false;
            setTimeout(() => {
                document.getElementById('modalEnd').style.display = 'flex';
            }, 2000);
        }
        function resetGame() {
            score = 0;
            scoreElement.textContent = score;
            timerElement.textContent = '1:00';
            document.querySelectorAll('.fallingItem').forEach(item => item.remove());
        }
        function createFallingItem() {
            if (!gameRunning) return;
            const itemTypes = [
                // { className: 'true nuez', isTrue: true },
                // { className: 'true nuez', isTrue: true },
                // { className: 'false avellana', isTrue: false },
                // { className: 'false hongo', isTrue: false },
                // { className: 'false pinia', isTrue: false }
                { className: 'true item-red', isTrue: true },
                { className: 'true item-blue', isTrue: true },
                { className: 'true item-green', isTrue: true },
                { className: 'false milk', isTrue: false }
            ];
            const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            const item = document.createElement('div');
            item.className = randomItem.className + ' fallingItem';
            gameContainer.appendChild(item);
            // Posicionamiento inicial aleatorio
            item.style.position = 'absolute';
            item.style.left = `${Math.random() * (gameContainer.offsetWidth - item.offsetWidth)}px`;
            item.style.top = '0px';
            // Hacer que los items caigan
            function animateFall() {
                if (!gameRunning) return;
                let itemRect = item.getBoundingClientRect();
                let sombreroRect = sombrero.getBoundingClientRect();
                // Detectar colisión solo por la parte superior del sombrero
                if (
                    itemRect.bottom >= sombreroRect.top && 
                    itemRect.left < sombreroRect.right && 
                    itemRect.right > sombreroRect.left
                ) {
                    item.remove();
                    if (randomItem.isTrue) {
                        // Suma score
                        score++;
                        // Audio True
                        // soundTrue.play();
                        // Muestra ícono
                        const correctIcon = document.getElementById('correct');
                        correctIcon.classList.add('show');
                        // Oculta ícono
                        setTimeout(() => {
                            correctIcon.classList.remove('show');
                        }, 300);
                    } else {
                        // Resta score
                        score--;
                        // Audio False
                        // soundFalse.play();
                        // Muestra ícono
                        const wrongIcon = document.getElementById('wrong');
                        wrongIcon.classList.add('show');
                        // Oculta ícono
                        setTimeout(() => {
                            wrongIcon.classList.remove('show');
                        }, 300);
                    }
                    scoreElement.textContent = score;
                }
                // Si el item llega al fondo, lo eliminamos
                if (itemRect.top >= gameContainer.offsetHeight) {
                    item.remove();
                } else {
                    item.style.top = `${item.offsetTop + 5}px`;
                    requestAnimationFrame(animateFall);
                }
            }
            requestAnimationFrame(animateFall);
        }
        // Función para actualizar el temporizador
        function updateTimer(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerElement.textContent = `Tiempo ${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }
    }
});


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
                if ((selectedRating >= 4) && (score >= 10)) {
                    console.log(selectedRating)
                    // Si calificó con 4 ó 5 y ganó:
                    pergamino1.style.display = "none";
                    pergaminoBien.style.display = "flex";
                    audioBien.play();  // Audio pergaminoBien
                } else if ((selectedRating >= 4) && (score <= 9)) {
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
            if ( (!btnContinueRank2.classList.contains('btnOff')) && (score  >= 10) ) {
                // Si el textarea tiene información, y ganó:
                pergamino1.style.display = "none";
                pergaminoBien.style.display = "flex";
                audioBien.play();  // Audio pergaminoBien
            } else if ( (!btnContinueRank2.classList.contains('btnOff')) && (score  <= 9) ) {
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