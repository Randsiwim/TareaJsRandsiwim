const preguntas = [
    {
        pregunta: "¿Cuál es el lenguaje de marcado utilizado para crear páginas web?",
        opciones: ["JavaScript", "HTML", "CSS", "Python"],
        respuesta: "HTML",
        dificultad: "fácil"
    },
    {
        pregunta: "¿Cuál es el símbolo para seleccionar un elemento por clase en CSS?",
        opciones: [".", "#", "*", "&"],
        respuesta: ".",
        dificultad: "media"
    },
    {
        pregunta: "¿Qué método se utiliza para añadir un elemento al final de un array en JavaScript?",
        opciones: ["push()", "pop()", "shift()", "unshift()"],
        respuesta: "push()",
        dificultad: "difícil"
    },
];

//elementos DOM
const inicioPantalla = document.getElementById('inicio');
const comenzarBtn = document.getElementById('comenzar-btn');
const preguntasPantalla = document.getElementById('preguntas');
const resultadosPantalla = document.getElementById('resultados');
const puntajeFinal = document.getElementById('puntaje-final');
const totalPreguntas = document.getElementById('total-preguntas');
const mensajeFinal = document.getElementById('mensaje-final');
const reiniciarBtn = document.getElementById('reiniciar-btn');
let preguntaActual = 0;
let puntaje = 0;

//comenzar quiz
comenzarBtn.addEventListener('click', () => {
    preguntas.sort(() => Math.random() - 0.5);
    inicioPantalla.classList.add('ocultar');
    preguntasPantalla.classList.remove('ocultar');
    preguntaActual = 0;
    puntaje = 0;
    mostrarPregunta();
    iniciarTemporizador();
});

const preguntaTexto = document.getElementById('pregunta-texto');
const opcionesLista = document.getElementById('opciones-lista');

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    preguntaTexto.textContent = pregunta.pregunta;
    opcionesLista.innerHTML = '';

    pregunta.opciones.forEach(opcion => {
        const li = document.createElement('li');
        li.textContent = opcion;
        li.classList.add('opcion');
        li.addEventListener('click', seleccionarOpcion);
        opcionesLista.appendChild(li);
    });
}

let opcionSeleccionada = null;

function seleccionarOpcion(e) {
    
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(op => op.classList.remove('seleccionado'));
    e.target.classList.add('seleccionado');
    opcionSeleccionada = e.target.textContent;
}

const siguienteBtn = document.getElementById('siguiente-btn');

siguienteBtn.addEventListener('click', () => {
    if (!opcionSeleccionada) {
        alert("Por favor, selecciona una respuesta antes de continuar.");
        return;
    }
    pausarTemporizador();
    verificarRespuesta();
    avanzarPregunta();
    iniciarTemporizador();
});

//verificar respuesta
function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    let puntosGanados = 0;

    if (opcionSeleccionada === pregunta.respuesta) {
        puntosGanados = 1;
        puntaje += puntosGanados;
        mostrarRetroalimentacion(true);
        } else {
        mostrarRetroalimentacion(false);
        } 
        opcionSeleccionada = null;
}

function avanzarPregunta() {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

function mostrarResultados() {
    preguntasPantalla.classList.add('ocultar');
    resultadosPantalla.classList.remove('ocultar');
    puntajeFinal.textContent = puntaje;
    totalPreguntas.textContent = preguntas.length;

    const porcentaje = (puntaje / preguntas.length) * 100;
    if (porcentaje === 100) {
        mensajeFinal.textContent = "Respondiste las preguntas correctamente.";
    } else if (porcentaje >= 70) {
        mensajeFinal.textContent = "Casi respondes todas las preguntas correctamente.";
    } else if (porcentaje >= 40) {
        mensajeFinal.textContent = "Está bien, pero puedes mejorar.";
    } else {
        mensajeFinal.textContent = "Necesitas estudiar más. ¡Inténtalo de nuevo!";
    }
}

reiniciarBtn.addEventListener('click', reiniciarQuiz);

function reiniciarQuiz() {
    resultadosPantalla.classList.add('ocultar');
    inicioPantalla.classList.remove('ocultar');
    preguntaActual = 0;
    puntaje = 0;
}

//retroalimentacion
const retroalimentacion = document.getElementById('retroalimentacion');

function mostrarRetroalimentacion(esCorrecto) {
    retroalimentacion.classList.remove('ocultar');
    if (esCorrecto) {
        retroalimentacion.textContent = "¡Correcto!";
        retroalimentacion.classList.add('correcto');
    } else {
        retroalimentacion.textContent = `Incorrecto. La respuesta correcta era: ${preguntas[preguntaActual].respuesta}`;
        retroalimentacion.classList.add('incorrecto');
    }
    setTimeout(() => {
        retroalimentacion.classList.add('ocultar');
        retroalimentacion.classList.remove('correcto', 'incorrecto');
    }, 2000);
}

//temporizador
let tiempoRestante;
let TemporizadorInterval;

function iniciarTemporizador() {
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    TemporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;

        if (tiempoRestante === 0) {
            pausarTemporizador();
            verificarRespuesta();
            avanzarPregunta();
            iniciarTemporizador(); 
        }
    }, 1000);
}

function pausarTemporizador() {
    clearInterval(TemporizadorInterval);
}

//guardar puntaje 
const historial = JSON.parse(localStorage.getItem('historial')) || [];
historial.push({
    fecha: new Date().toLocaleDateString(),
    puntaje: puntaje,
    total: preguntas.length
});
localStorage.setItem('historial', JSON.stringify(historial));





