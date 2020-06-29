
class pdfdisplay {
    fileReader;
    totalPages;
    currPage;
    file;

    constructor(file) {
        this.currPage = 1;
        this.file = file;
        this.loadFile(file);
        this.totalPages = this.fileReader.numPages;
    }

    loadFile() {
        this.fileReader = new FileReader();
        console.log("after creation");
        console.log(this.fileReader);
        // this.fileReader.readAsArrayBuffer(this.file);
        this.fileReader.onload = this.render;
    }

    render() {
        console.log('render function');
        console.log(this.fileReader);
        console.log(this.file);
        var typedarray = new Uint8Array(this.fileReader.result);
        console.log(typedarray);
        const loadingTask = pdfjsLib.getDocument(typedarray);
        loadingTask.promise.then(pdf => {
        // The document is loaded here...
            pdf.getPage(this.currPage).then(function(page) {
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

}