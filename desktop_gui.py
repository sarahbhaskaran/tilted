from tkinter import filedialog
from tkinter import *
import os
from pdf_reader import PDFReader
# import pdf_reader_tests


class DesktopGui():

    def __init__(self):
        self.file_finder_clicked = False
        self.pdf_file = "test.py"
        self.start_clicked = False
        self.recal_clicked = False

        self.dir = os.path.dirname(os.path.abspath(__file__))
        self.window = Tk()
        self.window.title("Tilted")
        self.window.geometry('350x200')
        file_btn = Button(self.window, text="Choose File", command=self.file_click)
        file_btn.grid(column=0, row=0)
        start_btn = Button(self.window, text="Start", command=self.start_click)
        start_btn.grid(column=1, row=0)
        recal_btn = Button(self.window, text="Recalibrate", command=self.recal_click)
        recal_btn.grid(column=2, row=0)
        start_btn = Button(self.window, text="Click Me", command=self.recal_click)
        self.window.mainloop()

    def await_filename(self):
        while not self.file_finder_clicked:
            pass
        self.window.filename =  filedialog.askopenfilename(initialdir = self.dir,
            title = "Select file",filetypes = (("pdf files","*.pdf"),("all files","*.*")))
        return self.window.filename

    def await_start(self):
        while not self.start_clicked:
            pass

        return self.start_clicked

    def file_click(self):
        self.file_finder_clicked = True

    def start_click(self):
        self.start_clicked = True
        # pdf_reader_tests.main(self.window.filename)

    def recal_click(self):
        self.recal_clicked = True

    def check_reset_recal(self):
        clicked = self.recal_clicked
        self.recal_clicked = False
        return clicked
