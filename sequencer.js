function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

// BufferLoader class taken from: https://www.html5rocks.com/en/tutorials/webaudio/intro/
BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function (error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function () {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

var step = 0;
var bufferList = null;
var context = new AudioContext();
var compressor = 0;

var bufferLoader = new BufferLoader(
    context,
    [
        'samples/bd.wav',
        'samples/sn.wav',
        'samples/clhat.wav',
        'samples/hitom.wav',
    ],
    (bl) => {
        bufferList = bl;
    });

bufferLoader.load();

var playing = false;
var bpm = 120;
var loop = null;
var rows = document.querySelectorAll('tr');
var bpmElement = document.getElementById('bpm-display');

function initialize() {

    compressor = context.createDynamicsCompressor();
    compressor.connect(context.destination);

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

function playBuffer(index) {
    var sound = context.createBufferSource();
    sound.buffer = bufferList[index];
    sound.connect(compressor);
    sound.start(0);
}

function playSound(sound) {
    if (sound == 'bd') {
        playBuffer(0);
    } else if (sound == 'sn') {
        playBuffer(1);
    } else if (sound == 'clhat') {
        playBuffer(2);
    } else if (sound == 'hitom') {
        playBuffer(3);
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


