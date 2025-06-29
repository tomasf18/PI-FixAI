from datetime import datetime
import time
import cv2
import requests
import threading


class Camera:
    def __init__(self, rtsp_url: str, target_fps: float):
        self.rtsp_url = rtsp_url
        self.target_fps = target_fps
        
        print("RTSP Connecting...", datetime.now().strftime("%H:%M:%S"))
        self.cap = cv2.VideoCapture(self.rtsp_url)
        if not self.cap.isOpened():
            raise ValueError("Cannot open RTSP stream")
        print("RTSP Connected!", datetime.now().strftime("%H:%M:%S"))

        self.fourcc = cv2.VideoWriter_fourcc(*'avc1')  # Use MPEG-4 codec
        self.width  = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        self.video_writers = set()
        self.lock = threading.Lock()

    def add_output(self, output_file: str):
        out = cv2.VideoWriter(output_file, cv2.CAP_FFMPEG, self.fourcc, self.target_fps, (self.width, self.height))
        with self.lock:
            self.video_writers.add(out)
        return out
        
    def remove_output(self, video_writer: cv2.VideoWriter):
        with self.lock:
            if video_writer in self.video_writers:
                self.video_writers.remove(video_writer)
                video_writer.release()
            else:
                raise ValueError("video_writer not found in output set")
        
    def record(self):
        
        while True:
            ret, frame = self.cap.read()
            if not ret:
                self.cap.release()
                raise ValueError("Stream ended or error.")
            
            with self.lock:
                for v in self.video_writers:
                    v.write(frame)

