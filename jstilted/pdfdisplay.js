
class pdfdisplay {
    showPage() {
        console.log("showpage function");
        const pdf_doc = pdfjsLib.getDocument("C:\Users\Sarah\tilted\jstilted\web");
        console.log(pdf_doc.numPages);
    }
}