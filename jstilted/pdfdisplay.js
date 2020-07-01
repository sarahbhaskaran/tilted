

const realFileBtn = document.getElementById("file");
const customBtn = document.getElementById("custom-button");
const forwardButton = document.querySelector('[data-forward]');
const backButton = document.querySelector('[data-back]');
const jumpButton = document.getElementById("jumpTo");
var file;
var fileReader;
var totalPages;
var currPageNumber;


const choose = document.querySelector('[data-choose]');
choose.addEventListener("click", function() {
    realFileBtn.click();
})



realFileBtn.addEventListener("click", function() {

    document.getElementById('file').onchange = function(event) {
        
    file = event.target.files[0];
    console.log(totalPages);
    fileReader = new FileReader();
    currPageNumber = 1;
    fileReader.onload = render;
    fileReader.readAsArrayBuffer(file);
    const img = document.getElementById("temp_img");
    img.style.display = "none";
    const canvas = document.getElementById("pdfCanvas");
    canvas.style.display = "inherit";
    console.log("should have disappeared");
    }
});

function next() {
    if (inPageRange(currPageNumber + 1)) {
        currPageNumber += 1;
        render();
    }
}

function goTo(n) {
    num = parseInt(n, 10);
    if (inPageRange(num)) {
        console.log(num)
        currPageNumber = num;
        render();
    }
}

function back() {
    if (inPageRange(currPageNumber - 1)) {
        currPageNumber -= 1;
        render();
    }
    
}

function inPageRange(pageNumber) {
    if (pageNumber < 1) {
        return false
    }
    if (pageNumber > totalPages) {
        return false
    }
    return true;
}


function render() {
    var typedarray = new Uint8Array(fileReader.result);
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadingTask.promise.then(pdf => {
    totalPages = pdf.numPages;
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
        console.log("page number");
        console.log(loadingTask.numPages);

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
    console.log("num pages");
    console.log(loadingTask.numPages);
    //end of example code
    });

}


forwardButton.addEventListener('click', button => {
    next();
})

backButton.addEventListener('click', button=> {
    back();
})

jumpButton.addEventListener('click', button=> {
    console.log("is this what I should be doing");
    goTo(document.getElementById('goToPage').value);
    document.getElementById('goToPage').value = "";
})
