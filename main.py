from tilted_cam import Tilted_Cam
from pdf_reader import PDFReader
from desktop_gui import DesktopGui
import tensorflow as tf

SIGNAL_THRESHOLD = 3

def run(reader):
    page_already_turned = False
    last_tilt = None
    counter = 0
    with tf.Session() as sess:
        cam = Tilted_Cam(sess, ear_threshold=0.1, tilt_threshold = 12)
        while True:
            head_tilted = cam.get_tilt(debug=True)
            if head_tilted != last_tilt:
                last_tilt = head_tilted
                counter = 0
                continue
            if counter < SIGNAL_THRESHOLD:
                counter += 1
                continue

            if head_tilted == 'right' and not page_already_turned:
                reader.turnForward()
                page_already_turned = True
            elif head_tilted == 'left' and not page_already_turned:
                reader.turnBackward()
                page_already_turned = True
            elif head_tilted == '':
                page_already_turned = False


if __name__ == "__main__":
    gui = DesktopGui()
    filename = gui.await_filename()
    filename = '/home/glassesman7/Downloads/test.pdf'
    reader = PDFReader(filename)
    gui.await_start()
    run(reader)
