import fitz
from PIL import Image, ImageTk
import time
import tkinter as tk

class PDFpage():
    page_index = 0
    pages = 0
    currpage = None
    def __init__(self, filename):
        self.file = filename
        self.doc = fitz.open(filename)
        self.pages = self.doc.pageCount

    def turnPage(self):
        self.page_index += 1
        self.showPage()
        self.currpage.close()

    def showPage(self):
        page = self.doc.loadPage(self.page_index)
        pix = page.getPixmap()

        mode = "RGBA" if pix.alpha else "RGB"
        img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
        self.currpage = img

        img.show()
        time.sleep(2)
        img.close()

doc = fitz.open("test.pdf")
pages = doc.pageCount

root = tk.Tk()
canvas = tk.Canvas(root, width = 300, height = 300)
canvas.pack()

for i in range(pages):
    page = doc.loadPage(i)
    pix = page.getPixmap()
    pix.writePNG("pg.png")
    #
    # mode = "RGBA" if pix.alpha else "RGB"
    # img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)

    # img.show()
    open_image = Image.open("pg.PNG")
    img = ImageTk.PhotoImage(open_image)

    canvas.create_image(20,20, anchor=tk.NW, image=img)
    root.update_idletasks()
    time.sleep(2)
    # tk.mainloop()

    # img = Image.open('pg.png')
    # img.show()
    # time.sleep(2)
    # img.load()
    # img.close()
# pdf = PDFpage('test.pdf')
# pdf.showPage()
# time.sleep(2)
# pdf.turnPage()
