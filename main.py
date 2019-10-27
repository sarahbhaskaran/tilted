from tilted_cam import Tilted_Cam
from pdf_reader import PDFReader
from desktop_gui import DesktopGui

SIGNAL_THRESHOLD = 5

def run(reader):
    page_already_turned = False
    counter = 0
    with tf.Session() as sess:
        cam = Tilted_Cam(sess)
        while True:
            if counter < SIGNAL_THRESHOLD:
                counter += 1
                continue
            if not page_already_turned:
                head_tilted = cam.get_tilt()
                if head_tilted == 'right':
                    reader.turnForward()
                    page_already_turned = True
                if head_tilted == 'left':
                    reader.turnBackward()
                    page_already_turned = True
                else:
                    page_already_turned = False

if __name__ == "__main__":
    gui = DesktopGui()
    filename = gui.await_filename()
    reader = PDFReader(filename)
    gui.await_start()
    run(reader)
