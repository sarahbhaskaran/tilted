from tkinter import filedialog
from tkinter import *
import tkinter as tk
from PIL import Image, ImageTk
import os
from pdf_reader import PDFReader
import pdb
# import pdf_reader_tests


class DesktopGui():

    def __init__(self):
        self.file_finder_clicked = False
        self.destroybutton_clicked = False
        self.start_clicked = False
        self.recal_clicked = False
        self.dir = os.path.dirname(os.path.abspath(__file__))
        self.window = Tk()
        self.window.title("Tilted")
        self.last_width = self.window.winfo_screenwidth()
        self.last_height = self.window.winfo_screenheight()
        self.window.geometry(str(self.last_width) + 'x' + str(self.last_height))
        self.canvas = tk.Canvas(self.window)
        self.window.columnconfigure(0, weight=1)
        self.window.columnconfigure(1, weight=1)
        self.window.columnconfigure(2, weight=1)
        self.window.columnconfigure(3, weight=1)
        #self.window.rowconfigure(0, weight=1)
        self.window.rowconfigure(1, weight=1)
        file_btn = Button(self.window, text="Choose File", command = self.clickFinder)
        file_btn.grid(column=0, row=0)
        start_btn = Button(self.window, text="Start", command = self.clickStart)
        start_btn.grid(column=1, row=0)
        recal_btn = Button(self.window, text="Recalibrate", command = self.clickRecal)
        recal_btn.grid(column=2, row=0)
        close_btn = Button(self.window, text="Close", command = self.clickDestroybutton)
        close_btn.grid(column=3, row=0)

        self.reader = self._get_reader()

    def clickDestroybutton(self):
        self.destroybutton_clicked = True

    def destroywindow(self):
        self.window.destroy()


    def clickFinder(self):
        self.file_finder_clicked = True

    def clickStart(self):
        self.start_clicked = True

    def clickRecal(self):
        self.recal_clicked = True

    def reset_recal(self):
        self.recal_clicked = False

    def _get_reader(self):
        filename = self.await_filename()
        return PDFReader(filename)

    def await_filename(self):
        while not self.file_finder_clicked:
            self.window.update()
        self.window.filename =  filedialog.askopenfilename(initialdir = self.dir,
            title = "Select file",filetypes = (("pdf files","*.pdf"),("all files","*.*")))
        return self.window.filename

    def await_start(self):
        while not self.start_clicked:
            self.update()

        return self.start_clicked

    def draw_page(self):
        '''
        Ask PDFReader for page to draw
        '''
        open_image = Image.open(self.reader.getPagePath())
        image_ratio = open_image.width / open_image.height
        dh = self.last_height - open_image.height
        dw = self.last_width - open_image.width
        if dw > dh:
            resized = open_image.resize((int(self.last_height * image_ratio), self.last_height), Image.ANTIALIAS)
        else:
            resized = open_image.resize((self.last_width, int(self.last_height // image_ratio)), Image.ANTIALIAS)


        img = ImageTk.PhotoImage(resized)

        # self.canvas = tk.Canvas(master)
        # self.img = ImageTk.PhotoImage(Image.open(self.dir), master=self.canvas)
        #
        #
        # self.canvas.config(height=self.screen_height, width=self.screen_width)
        #
        # self.canvas.create_image((0, 0), image=img)
        # self.canvas.update()
        # self.update()

        self.canvas = tk.Canvas(self.window)
        self.canvas.config(height=self.window.winfo_screenheight(), width=self.window.winfo_screenwidth())
        self.img = ImageTk.PhotoImage(resized, master=self.canvas)
        self.canvas.create_image(self.last_width//2 ,self.last_height//2, image=self.img)
        self.canvas.grid(columnspan = 4, row = 2)

        self.update()

    def update(self):
        if self.window.winfo_width() != self.last_width or self.window.winfo_height() != self.last_height:
            self.last_width = self.window.winfo_width()
            self.last_height = self.window.winfo_height()
            self.window.geometry(str(self.last_width) + 'x' + str(self.last_height))

            self.draw_page()
        self.window.update_idletasks()
        self.window.update()
