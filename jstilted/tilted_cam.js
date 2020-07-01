const LEFT_EYE_INDEX = 1;
const RIGHT_EYE_INDEX = 2;
const LEFT_EAR_INDEX = 3;
const RIGHT_EAR_INDEX = 4;

class TiltedCam {
    static LEFT_EYE_INDEX = 1;
    static RIGHT_EYE_INDEX = 2;
    static LEFT_EAR_INDEX = 3;
    static RIGHT_EAR_INDEX = 4;

    constructor(tf_session, tilt_threshold=20, ear_threshold=.1, calibration_duration=10) {
        this.tilt_threshold = tilt_threshold;
        this.ear_threshold = ear_threshold;
        this.calibration_duration = calibration_duration;
        this.frame_count = 0;
        this.angle_baseline = 0;
        this.tf_session = tf_session;
        const net = posenet.load();

        if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
            console.log("error with video");
        }
        this.stream;
        this.cameraStart();
        this.getTilt();
    }

    getTilt() {
        posenet.load().then(function(net) {
            console.log("getTilt");
            const pose = net.estimateSinglePose(this.stream, {
              flipHorizontal: true
            });
            return pose;
          }.bind(this)).then(function(pose){
            console.log(pose);
          })
    }

    cameraStart() {
        navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}}).then(function(stream)
         {
            // var track = stream.getTracks()[0];
            this.stream = stream;
         }.bind(this))
        .catch(function(error) 
        {
            console.error("Oops. Something is broken.", error);
        });
    }
}