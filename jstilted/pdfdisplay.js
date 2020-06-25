
class pdfdisplay {
    showPage() {
        console.log("showpage function");
        // const filename = "C:/Users/Sarah/tilted/jstilted/input/test.pdf"
        const filename = "../input/test.pdf"
        var file = new File(124393, filename);
        var fileReader = new FileReader();  
        var typedarray = new Uint8Array(filename);
        console.log(typedarray);
        const pdf_doc = pdfjsLib.getDocument(typedarray);
        console.log(pdf_doc.numPages);
    }
}