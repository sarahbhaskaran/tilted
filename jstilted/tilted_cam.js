const LEFT_EYE_INDEX = 1;
const RIGHT_EYE_INDEX = 2;
const LEFT_EAR_INDEX = 3;
const RIGHT_EAR_INDEX = 4;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
  

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

        const net = posenet.load();

        if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
            console.log("error with video");
        }
        this.stream;
        this.cameraStart();
        // this.getTilt();
    }

    getTilt() {
        posenet.load().then(function(net) {
            const pose = net.estimateSinglePose(this.cameraView, {
              flipHorizontal: true
            });
            console.log("estimated");
            return pose;
          }.bind(this)).then(function(pose){
            console.log(pose);
          })
    }

    getKeypoint(keypointName, poseIndex) {
        try{
            var index = posenet.PART_NAMES.index(keypointName);
        }
        catch(e){
            console.log("Keypoint name not valid");
            throw(e);
        }
        return (this.keypointScores[poseIndex, index], 
            this.keypointCoords[poseIndex, index]);
    }

    getAngle(poseIndex){
        this.right = this.getKeypoint('rightEye', poseIndex)[1]
        this.left = this.getKeypoint('leftEye', poseIndex)[1]

        dx = right[1] - left[1]
        dy = right[0] - left[0]

        return Math.degrees(math.atan2(dy, dx))
    }

    isTurned(pose_index){
        rightEar = this.keypointScores[this.getPrincipalIndex(), TiltedCam.RIGHT_EAR_INDEX]
        leftEar = this.keypointScores[this.getPrincipalIndex(), TiltedCam.LEFT_EAR_INDEX]
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

    
}