import fitz
from PIL import Image, ImageTk
import tkinter as tk
import os

class PDFReader():
    page_index = 0
    pages = 0
    canvas = None
    root = None
    page_file = None
    dir = None
    def __init__(self, filename):
        self.dir = os.path.dirname(os.path.abspath(__file__))
        self.page_file = os.path.join(self.dir, "pg.png")
        self.file = filename
        self.doc = fitz.open(filename)
        self.pages = self.doc.pageCount
        self.root = tk.Tk()
        self.canvas = tk.Canvas(self.root)
        self.canvas.pack()
        self.showPage()

    def turnForward(self):
        self.page_index = min(self.page_index + 1, self.pages - 1)
        self.showPage()

    def turnBackward(self):
        self.page_index = max(self.page_index - 1, 0)
        self.showPage()

    def goToPage(self, i):
        self.page_index = max(0, min(i, self.pages - 1))
        self.showPage()

    def showPage(self):
        page = self.doc.loadPage(self.page_index)
        pix = page.getPixmap()
        pix.writePNG("pg.png")

        self.canvas.config(height=pix.height, width=pix.width)
        open_image = Image.open(self.page_file)
        img = ImageTk.PhotoImage(open_image, master=self.canvas)

        self.canvas.create_image(0,0, anchor=tk.NW, image=img)
        self.root.update_idletasks()
        self.root.update()

    # def closeWindow(self):
    #     self.root.destroy()
