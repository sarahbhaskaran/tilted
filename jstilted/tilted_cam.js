const LEFT_EYE_INDEX = 1;
const RIGHT_EYE_INDEX = 2;
const LEFT_EAR_INDEX = 3;
const RIGHT_EAR_INDEX = 4;

const debug = true;

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

    constructor(tfSession, tiltThreshold=20, earThreshold=.1, calibrationDuration=10) {
        this.tiltThreshold = tiltThreshold;
        this.earThreshold = earThreshold;
        this.calibrationDuration = calibrationDuration;
        this.frameCount = 0;
        this.angleBaseline = 0;
        this.tfSession = tfSession;

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
        posenet.load().then(function(net) {
            const pose = net.estimateSinglePose(this.cameraView, {
              flipHorizontal: true
            });
            console.log("estimated");
            return pose;
          }.bind(this)).then(function(pose){
            console.log(pose);
            this.pose = pose;
            this.calculateTilt();
          }.bind(this))
          console.log("here");
          var result = this.tilt;
          if (result == "right") {
            console.log("right");
            pdfdisplay.next();
          }
          if (result == "left") {
            console.log("left");
            pdfdisplay.back();
          }
          return this.tilt;
    }

    calculateTilt() {
        if (this.frameCount < 5) {
            this.angleBaseline += this.getAngle()
            this.frameCount++;
        }
        else if (this.frameCount == 5) {
            this.calibrate()
            this.frameCount++;
        }

        var isTurn = this.isTurned();
        this.tilt;
        if(this.getAngle() > this.tiltThreshold + this.angleBaseline && !isTurn) {
            this.tilt = 'right';
        }
        else if (this.getAngle() < -1*this.tiltThreshold + this.angleBaseline && !isTurn) {
            this.tilt = 'left';
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

    
}