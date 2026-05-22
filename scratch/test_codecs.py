import cv2
import numpy as np
import os

WIDTH, HEIGHT = 640, 480
codecs = ['mp4v', 'avc1', 'XVID', 'MJPG', 'WMV2', 'H264']
backends = [cv2.CAP_ANY, cv2.CAP_MSMF, cv2.CAP_DSHOW]

for backend in backends:
    for codec in codecs:
        try:
            fourcc = cv2.VideoWriter_fourcc(*codec)
            test_file = f"test_{codec}_{backend}.mov"
            writer = cv2.VideoWriter(test_file, backend, fourcc, 30, (WIDTH, HEIGHT))
            if writer.isOpened():
                # Write a frame
                frame = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
                writer.write(frame)
                writer.release()
                if os.path.exists(test_file) and os.path.getsize(test_file) > 0:
                    print(f"SUCCESS: codec={codec}, backend={backend}")
                    os.remove(test_file)
                else:
                    print(f"FAILED (0-byte): codec={codec}, backend={backend}")
                    if os.path.exists(test_file):
                        os.remove(test_file)
            else:
                print(f"FAILED (not opened): codec={codec}, backend={backend}")
        except Exception as e:
            print(f"ERROR: codec={codec}, backend={backend}: {e}")
