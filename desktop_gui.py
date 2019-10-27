from tkinter import filedialog
from tkinter import *
import os
import pdf_reader_tests

tilted_dir = os.path.dirname(os.path.abspath(__file__))
def file_click():
    window.filename =  filedialog.askopenfilename(initialdir = tilted_dir,
        title = "Select file",filetypes = (("pdf files","*.pdf"),("all files","*.*")))
    print(window.filename)

def start_click():
    pdf_reader_tests.main(window.filename)

def recal_click():
    lbl.configure(text="other was clicked")

window = Tk()
window.title("Tilted")
window.geometry('350x200')
file_btn = Button(window, text="Choose File", command=file_click)
file_btn.grid(column=0, row=0)
start_btn = Button(window, text="Start", command=start_click)
start_btn.grid(column=1, row=0)
recal_btn = Button(window, text="Recalibrate", command=recal_click)
recal_btn.grid(column=2, row=0)
start_btn = Button(window, text="Click Me", command=recal_click)
window.mainloop()
