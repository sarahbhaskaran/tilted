pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';
class main {
    constructor() {
        
    }
    run() {
        console.log("progress")
        const pdfd = new pdfdisplay();
        pdfd.showPage();
        console.log('showed page');
        return 
     }
}




//const chooseFileButton = document.querySelector('[data-choose]')
const startButton = document.querySelector('[data-start]')
const recalibrateButton = document.querySelector('[data-recalibrate]')
const forwardButton = document.querySelector('[data-forward]')
const backButton = document.querySelector('[data-back]')
const realFileBtn = document.getElementById("file");
const customBtn = document.getElementById("custom-button");
const session = new main()
var pdf;


realFileBtn.addEventListener("click", function() {
    console.log("getting here")
    
    document.getElementById('file').onchange = function(event) {
        pdf = new pdfdisplay(event.target.files[0]);
    }
});




// chooseFileButton.addEventListener('click', button => {
//     console.log("choose file")
//     //initialize pdf
//     pdf = "hello"//= new pdfdisplay()
//     //call method in choose File file
// })

startButton.addEventListener('click', button => {
    console.log("start")
    openFullscreen();
    // session.run()
    //call start loop
    //probably calls the loop in this file
})

recalibrateButton.addEventListener('click', button => {
    //call method in recalibrate
    //call loop again
    console.log("recalibrate")
    session.run()
})

forwardButton.addEventListener('click', button => {
    pdf.forward()
})

backButton.addEventListener('click', button=> {
    pdf.back()
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
