import tensorflow as tf
import cv2
import time
import argparse

import posenet
import numpy as np
import math
import pdb

parser = argparse.ArgumentParser()
parser.add_argument('--model', type=int, default=101)
parser.add_argument('--cam_id', type=int, default=0)
parser.add_argument('--cam_width', type=int, default=1280)
parser.add_argument('--cam_height', type=int, default=720)
parser.add_argument('--scale_factor', type=float, default=0.7125)
parser.add_argument('--file', type=str, default=None, help="Optionally use a video file instead of a live camera")
args = parser.parse_args()

class Tilted_Cam:
    LEFT_EYE_INDEX = 1
    RIGHT_EYE_INDEX = 2
    LEFT_EAR_INDEX = 3
    RIGHT_EAR_INDEX = 4
    def __init__(self, thres = 20, ear_thres = 0.1, calib_dur = 10):
        self.keypoint_scores = None
        self.keypoint_coords = None
        self.tilt_threshold = thres
        self.ear_threshold = ear_thres
        self.calibration_duration = calib_dur
        self.frame_count = 0
        self.angle_baseline = 0

    def update_predictions(self, ks, kc, output_scale):
        self.keypoint_scores = ks
        self.keypoint_coords = kc * output_scale

    def get_keypoint(self, keypoint_name, pose_index):
        '''
        Args:
            keypoint_name: ['nose' | 'leftEye' | 'rightEye' | 'leftEar' | 'rightEar'
            | 'leftShoulder' | 'rightShoulder' | 'leftElbow' | 'rightElbow' | 'leftWrist' | 'rightWrist'
            | 'leftHip' | 'rightHip' | 'leftKnee' | 'rightKnee' | 'leftAnkle' | 'rightAnkle']

            pose_index: index of the pose to be examined
        Returns:
            (keypoint_score, keypoint_coord)
        '''
        try:
            index = posenet.PART_NAMES.index(keypoint_name)
        except ValueError as e:
            print('Keypoint name {} not valid'.format(keypoint_name))
            raise e
        return (self.keypoint_scores[pose_index, index], self.keypoint_coords[pose_index, index, :])

    def get_angle(self, pose_index):
        '''
        Args:
            pose_index: index of the pose to be examined
        Returns:
            angle in degrees
        '''
        right = self.get_keypoint('leftEye', pose_index)[1] # Need to swap because camera is mirrored
        left = self.get_keypoint('rightEye', pose_index)[1]

        dx = right[1] - left[1]
        dy = right[0] - left[0]

        return math.degrees(math.atan2(dy, dx))

    def is_turned(self, pose_index):
        '''
        Returns: whether head is currently turned. Based on confidence estimates of ear locations.
        '''
        right_ear = self.keypoint_scores[self.get_principal_index(), Tilted_Cam.RIGHT_EAR_INDEX]
        left_ear = self.keypoint_scores[self.get_principal_index(), Tilted_Cam.LEFT_EAR_INDEX]
        return left_ear < self.ear_threshold or right_ear < self.ear_threshold

    def get_tilt(self, pose_index):
        '''
        Returns: 'left', 'right', or ''
        '''
        is_turned = self.is_turned(pose_index)

        if self.get_angle(pose_index) > self.tilt_threshold + self.angle_baseline and not is_turned:
            return 'left'
        elif self.get_angle(pose_index) < -1 * self.tilt_threshold + self.angle_baseline and not is_turned:
            return 'right'
        else:
            return ''

    def get_principal_index(self):
        num_poses = self.keypoint_coords.shape[0]
        max_index = 0
        max_norm = 0
        for pose_index in range(num_poses):
            left = self.get_keypoint('leftEye', pose_index)[1]
            right = self.get_keypoint('rightEye', pose_index)[1]
            distance = np.linalg.norm(left - right)
            if distance > max_norm:
                max_norm = distance
                max_index = pose_index
            if np.sum(self.keypoint_scores[pose_index, :]) == 0:
                break
        return max_index

    def recalibrate(self):
        '''
        Resets frame_count and angle_baseline so that watch() can take a new average measurement
        '''
        self.angle_baseline = 0
        self.frame_count = 0

    def _calibrate(self):
        '''
        DO NOT CALL THIS FUNCTION IF NOT THIS MODULE
        '''
        self.angle_baseline /= self.calibration_duration


    def watch(self):
        with tf.Session() as sess:
            model_cfg, model_outputs = posenet.load_model(args.model, sess)
            output_stride = model_cfg['output_stride']

            if args.file is not None:
                cap = cv2.VideoCapture(args.file)
            else:
                cap = cv2.VideoCapture(args.cam_id)
            cap.set(3, args.cam_width)
            cap.set(4, args.cam_height)

            start = time.time()

            while True:
                input_image, display_image, output_scale = posenet.read_cap(
                    cap, scale_factor=args.scale_factor, output_stride=output_stride)

                heatmaps_result, offsets_result, displacement_fwd_result, displacement_bwd_result = sess.run(
                    model_outputs,
                    feed_dict={'image:0': input_image}
                )

                pose_scores, keypoint_scores, keypoint_coords = posenet.decode_multi.decode_multiple_poses(
                    heatmaps_result.squeeze(axis=0),
                    offsets_result.squeeze(axis=0),
                    displacement_fwd_result.squeeze(axis=0),
                    displacement_bwd_result.squeeze(axis=0),
                    output_stride=output_stride,
                    max_pose_detections=10,
                    min_pose_score=0.15)
                self.update_predictions(keypoint_scores, keypoint_coords, output_scale)

                if self.frame_count < 5:
                    self.angle_baseline += self.get_angle(self.get_principal_index())
                    self.frame_count += 1
                elif self.frame_count == 5:
                    self._calibrate()
                    self.frame_count += 1

                tilt = self.get_tilt(self.get_principal_index())
                if tilt:
                    print('{} tilt detected!'.format(tilt))
                else:
                    pass
                print(self.angle_baseline)

                print()

                # TODO this isn't particularly fast, use GL for drawing and display someday...
                overlay_image = posenet.draw_skel_and_kp(
                    display_image, pose_scores, self.keypoint_scores, self.keypoint_coords,
                    min_pose_score=0.15, min_part_score=0.1)

                cv2.imshow('posenet', overlay_image)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

if __name__ == "__main__":
    cam = Tilted_Cam()
    cam.watch()
