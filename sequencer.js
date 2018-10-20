var step = 0;

// audio objects:
var bd = new Audio('samples/bd.wav');
var sn = new Audio('samples/sn.wav');
var clhat = new Audio('samples/clhat.wav');
var hitom = new Audio('samples/hitom.wav');


var playing = false;
var bpm = 120;
var loop = null;
var rows = document.querySelectorAll('tr');
var bpmElement = document.getElementById('bpm-display');

function initialize() {
    bpmElement.innerText = bpm + ' bpm';

    document.querySelectorAll('.step').forEach(element => {
        element.onclick = activateStep;
    });

    document.getElementById('play-btn').onclick = (ev) => {
        step = 0;
        if (playing) {
            clearPlayhead();
            clearTimeout(loop);
        } else {
            playLoop();
        }
        playing = !playing;
    }
    document.getElementById('bpm-slider').onchange = (ev) => {
        bpm = ev.target.value;
        bpmElement.innerText = bpm + ' bpm';
        step = 0;
        clearPlayhead();
        clearInterval(loop);
        playLoop();
        playing = true;
    }
}

function clearPlayhead() {
    playheads = document.querySelectorAll('.playhead');
    playheads.forEach(element => {
        element.classList.remove('playhead');
    });

}

function activateStep() {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
    } else {
        this.classList.add('active');
    }
}

function playSound(sound) {
    if (sound == 'bd') {
        bd.pause();
        bd.currentTime = 0;
        bd.play();
    } else if (sound == 'sn') {
        sn.pause();
        sn.currentTime = 0;
        sn.play();
    } else if (sound == 'clhat') {
        clhat.pause();
        clhat.currentTime = 0;
        clhat.play();
    } else if (sound == 'hitom') {
        hitom.pause();
        hitom.currentTime = 0;
        hitom.play();
    }
}

function playLoop() {
    rows.forEach(row => {
        row.cells[step].classList.remove('playhead');
    })

    step = (step + 1) % 16

    rows.forEach(row => {
        row.cells[step].classList.add('playhead');
        if (row.cells[step].classList.contains('active')) {
            playSound(row.cells[step].getAttribute('data-sound'));
        }
    })

    loop = window.setTimeout(playLoop, (60000 / bpm) / 4);
}

initialize();


