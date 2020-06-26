

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
var pdf = document.querySelector('[data-pdf]')

const session = new main()


// realFileBtn.addEventListener("click", function() {
//     console.log("getting here")

//     document.getElementById('file').onchange = function(event) {
//     var file = event.target.files[0];
//     console.log(file);
//     var fileReader = new FileReader();
//     console.log("hello")
//     console.log(fileReader);
//     console.log("bye")
    
//     fileReader.onload = function() {
//         var typedarray = new Uint8Array(this.result);
//         console.log(this)
//         console.log(typedarray);
//         const loadingTask = pdfjsLib.getDocument(typedarray);
//         loadingTask.promise.then(pdf => {
//         // The document is loaded here...
//         //This below is just for demonstration purposes showing that it works with the moderen api
//         pdf.getPage(1).then(function(page) {
//             console.log('Page loaded');

//             var scale = .7;
//             var viewport = page.getViewport({
//             scale: scale
//             });

//             var canvas = document.getElementById('pdfCanvas');
//             var context = canvas.getContext('2d');
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;

//             // Render PDF page into canvas context
//             var renderContext = {
//             canvasContext: context,
//             viewport: viewport
//             };
//             var renderTask = page.render(renderContext);
//             renderTask.promise.then(function() {
//             console.log('Page rendered');
//             });

//         });
//         //end of example code
//         });

//     }
//     fileReader.readAsArrayBuffer(file);
//     }
// });




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
    console.log("getting to forward");
    second();
    console.log("left");
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
