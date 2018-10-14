var step = 0;
var bd = new Audio('samples/bd.wav');
var sn = new Audio('samples/sn.wav');
var clhat = new Audio('samples/clhat.wav');
var playing = false;

function initialize() {
    document.querySelectorAll('.step').forEach(element => {
        element.onclick = activateStep;
        switch (element.parentNode.id) {
            case "bd":
                element.setAttribute("data-sound", "bd");
                break;
            case "sn":
                element.setAttribute("data-sound", "sn");
                break;
            case "clhat":
                element.setAttribute("data-sound", "clhat");
                break;
        }
    });
    document.getElementById('play-btn').onclick = () => {
        playing = !playing;
        console.log(playing)
    }
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
        bd.play();
    } else if (sound == 'sn') {
        sn.play();
    } else if (sound == 'clhat') {
        clhat.play();
    }
}

function playLoop() {
    var rows = document.querySelectorAll('tr');
    console.log(rows);
    setInterval(function () {
        if (playing) {
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
        }
    }, 250);
}
initialize();
playLoop();
