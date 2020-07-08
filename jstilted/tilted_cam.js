const LEFT_EYE_INDEX = 1;
const RIGHT_EYE_INDEX = 2;
const LEFT_EAR_INDEX = 3;
const RIGHT_EAR_INDEX = 4;

const debug = false;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
};

function radToDeg(rad) {
    return rad / (Math.PI / 180);
};
  
  
class TiltedCam {
    static LEFT_EYE_INDEX = 1;
    static RIGHT_EYE_INDEX = 2;
    static LEFT_EAR_INDEX = 3;
    static RIGHT_EAR_INDEX = 4;

    constructor(tfSession, tiltThreshold=20, earThreshold=.1, calibrationDuration=5) {
        this.tiltThreshold = tiltThreshold;
        this.earThreshold = earThreshold;
        this.calibrationDuration = calibrationDuration;
        this.angleBaseline = 0;
        this.tfSession = tfSession;
        this.pdf = new pdfDisplay();
        this.running = false;
        this.previousTilt = "";
        this.lastSwitched = 3;
        this.right = 'right';
        this.left = 'left';
        this.recalibrating = 0;
        this.tempBase = 0;

        this.cameraView = document.querySelector("#camera--view");
        this.cameraOutput = document.querySelector("#camera--output");
        this.cameraSensor = document.querySelector("#camera--sensor");
        this.cameraView.width = 500;
        this.cameraView.height = 500;
        const net = posenet.load();
        

        if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
            console.log("error with video");
        }
        this.stream;
        this.cameraStart();
        // this.getTilt();
    }

    async getTilt() {
        if (!this.running) {return;}
        posenet.load().then(function(net) {
            const pose = net.estimateSinglePose(this.cameraView, {
              flipHorizontal: true
            });
            console.log("estimated");
            return pose;
          }.bind(this)).then(function(pose){
            console.log(pose);
            this.pose = pose;
            return this.calculateTilt();
          }.bind(this)).then(function(result) {
            if (this.recalibrating <= this.calibrationDuration) {
                console.log("IT IS RECALIBRATING");
                console.log("THIS IS FRAME");
                console.log(this.recalibrating);
                console.log("Of RECALIBRATION");
                this.recalibrating++;
            } 
            else if (this.previousTilt == result || this.lastSwitched < 3) {
                this.lastSwitched++;
                console.log("throttle");
            }
            else if (result == "right") {
                this.lastSwitched = 0;
                console.log("right");
                this.previousTilt = result;
                this.pdf.next();
            }
            else if (result == "left") {
                this.lastSwitched = 0;
                this.previousTilt = result;
                console.log("left");
                this.pdf.back();
            }
            else {
                this.lastSwitched++;
                this.previousTilt = result;
                console.log("neither");
            }
          }.bind(this)).then(function () {
              this.getTilt();
          }.bind(this));
    }

    calculateTilt() {
        if (this.recalibrating < this.calibrationDuration) {
            this.tempBase += this.getAngle();
            //get new baseline
        } else if (this.recalibrating == this.calibrationDuration) {
            this.angleBaseline = this.tempBase;
            this.calibrate();
            this.tempBase = 0;
            console.log(this.angleBaseline);
        }

        var isTurn = this.isTurned();
        this.tilt;
        if(this.getAngle() > this.tiltThreshold + this.angleBaseline && !isTurn) {
            this.tilt = this.left;
        }
        else if (this.getAngle() < -1*this.tiltThreshold + this.angleBaseline && !isTurn) {
            this.tilt = this.right;
        }
        else {
            this.tilt = '';
        }
        if (debug) {
            if (this.tilt) {
                console.log(this.tilt+' tilt detected!');
            }
            else {
                console.log('.')
            }
        }
        return this.tilt;
    }

    recalibrate() {
        this.recalibrating = 0;
    }

    getAngle(){
        const right = this.pose['keypoints'][RIGHT_EYE_INDEX]['position']
        const left = this.pose['keypoints'][LEFT_EYE_INDEX]['position']

        const dx = right['x'] - left['x']
        const dy = right['y'] - left['y']

        return radToDeg(Math.atan2(dy, dx))
    }

    isTurned(){
        const rightEar = this.pose['keypoints'][RIGHT_EAR_INDEX]['score']
        const leftEar = this.pose['keypoints'][LEFT_EAR_INDEX]['score']
        return leftEar < this.ear_threshold || rightEar < this.earThreshold
    }

    cameraStart() {
        console.log("camera start");
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}}).then(function(stream)
         {
            // var track = stream.getTracks()[0];
            // this.stream = stream;
            this.cameraView.srcObject = stream;
         }.bind(this))
        .catch(function(error) 
        {
            console.error("Oops. Something is broken.", error);
        });
    }

    calibrate() {
        this.angleBaseline /= this.calibrationDuration;
    }

    toggleRunning() {
        this.running = !this.running;
        if (this.running) {
            const startButton = document.querySelector('[data-start]').innerHTML = 
            '<ion-icon name="stop-outline"></ion-icon>';
        }
        else {
            const startButton = document.querySelector('[data-start]').innerHTML = 
            '<ion-icon name="play-outline"></ion-icon>';
        }
    }

    swap() {
        var temp = this.left;
        this.left = this.right;
        this.right = temp;
    }
}