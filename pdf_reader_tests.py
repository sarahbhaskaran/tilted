import time
from pdf_reader import PDFReader

def main(filename = 'test.pdf'):
    pdf = PDFReader(filename)
    for i in range(4):
        time.sleep(2)
        pdf.turnForward()
    for i in range(3):
        time.sleep(1)
        pdf.turnBackward()
    time.sleep(1)
    pdf.goToPage(2)
    time.sleep(1)
    pdf.goToPage(0)
    time.sleep(1)
    # Should go to page 3 (fourth page)
    pdf.goToPage(5)
    time.sleep(1)
    # Should go to page 0
    pdf.goToPage(-1)
    # pdf.closeWindow()

if __name__=="__main__":
    main()
