

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';

var tcam;
const canvas = document.getElementById("pdfCanvas");
canvas.style.display = "none";
const startButton = document.querySelector('[data-start]')
const recalibrateButton = document.querySelector('[data-recalibrate]')
var pdf = document.querySelector('[data-pdf]')

var pdf;
var started = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

startButton.addEventListener('click', button => {
    // started = true;
    tcam.toggleRunning();
    // run();
    tcam.getTilt();
    console.log(tcam.getTilt());

})

recalibrateButton.addEventListener('click', button => {
    //call method in recalibrate
    //call loop again
    console.log("recalibrate")
    // started = false;
    tcam.recalibrate();
})

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.getElementById("pdfCanvas");

/* View in fullscreen */
function openFullscreen() {
    console.log("Fullscreen function");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

window.addEventListener("load", function () {
  tcam = new TiltedCam();
}, false);
