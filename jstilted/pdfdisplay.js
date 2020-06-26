

const realFileBtn = document.getElementById("file");
const customBtn = document.getElementById("custom-button");
const forwardButton = document.querySelector('[data-forward]')
const backButton = document.querySelector('[data-back]')
var file;
var fileReader;
var totalPages;
var currPageNumber;

realFileBtn.addEventListener("click", function() {
    console.log("getting here")

    document.getElementById('file').onchange = function(event) {
    file = event.target.files[0];
    fileReader = new FileReader();
    currPageNumber = 1;
    fileReader.onload = render;
    fileReader.readAsArrayBuffer(file);
    }
});

function second() {
    console.log("second");
    currPageNumber = 2;
    render();
}

function render() {
    var typedarray = new Uint8Array(fileReader.result);
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadingTask.promise.then(pdf => {
    // The document is loaded here...
    //This below is just for demonstration purposes showing that it works with the moderen api
    pdf.getPage(currPageNumber).then(function(page) {
        console.log('Page loaded');
        var scale = .7;
        var viewport = page.getViewport({
        scale: scale
        });

        var canvas = document.getElementById('pdfCanvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
        canvasContext: context,
        viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
        console.log('Page rendered');
        });

    });
    //end of example code
    });

}


forwardButton.addEventListener('click', button => {
    second();
})

backButton.addEventListener('click', button=> {
    
})