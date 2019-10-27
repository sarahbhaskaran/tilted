import fitz
from PIL import Image, ImageTk
import time
import tkinter as tk

class PDF():
    page_index = 0
    pages = 0
    canvas = None
    root = None
    page_file = 'pg.png'
    def __init__(self, filename):
        self.file = filename
        self.doc = fitz.open(filename)
        self.pages = self.doc.pageCount
        self.root = tk.Tk()
        self.canvas = tk.Canvas(self.root)
        self.canvas.pack()
        self.showPage()

    def turnPage(self):
        self.page_index = min(self.page_index + 1, self.pages - 1)
        self.showPage()

    def showPage(self):
        page = self.doc.loadPage(self.page_index)
        pix = page.getPixmap()
        pix.writePNG("pg.png")

        self.canvas.config(height=pix.height, width=pix.width)
        open_image = Image.open(self.page_file)
        img = ImageTk.PhotoImage(open_image)

        self.canvas.create_image(20,20, anchor=tk.NW, image=img)
        self.root.update_idletasks()
        self.root.update()

    def closeWindow(self):
        self.root.destroy()


pdf = PDF('test.pdf')
for i in range(4):
    time.sleep(2)
    pdf.turnPage()
time.sleep(1)
pdf.closeWindow()
