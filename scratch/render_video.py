import imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import random
import math
import os
import sys

# Video configuration
WIDTH = 1920
HEIGHT = 1080
FPS = 30
TOTAL_FRAMES = 300

# Center burst origin
CX = WIDTH * 0.50
CY = HEIGHT * 0.48

def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def get_safe_zone_factor(x, y):
    # Elliptical boundaries for center 60% width x 45% height safe zone.
    # Center: (cx = 0.5, cy = 0.465)
    cx_norm = 0.50 * WIDTH
    cy_norm = 0.465 * HEIGHT
    
    # Safe zone widths: 
    # Horizontal radius: 0.30 * WIDTH = 576px (corresponds to center 60%)
    # Vertical radius: 0.225 * HEIGHT = 243px (corresponds to center 45%)
    rx = (x - cx_norm) / 576.0
    ry = (y - cy_norm) / 243.0
    dist = math.sqrt(rx * rx + ry * ry)
    
    # Safe zone factor is 0.0 deep inside, ramps to 1.0 at boundary
    # We choose transition between 0.75 and 1.15 to be extremely soft and organic
    return smoothstep(0.75, 1.15, dist)

class Particle:
    def __init__(self, mode, is_burst=True):
        self.mode = mode
        self.is_burst = is_burst
        self.T_b = random.randint(0, TOTAL_FRAMES - 1)
        self.L = random.randint(100, 160) # Lifetime in frames (3.3 - 5.3 seconds)
        
        # Color palettes
        if mode == 'light':
            # Main: #0F9F96, #19C7BD, #56D6FF
            # Accent: #7CFFCB, #B89CFF, #F2C96D
            colors = [
                (15, 159, 150), (25, 199, 189), (86, 214, 255),  # Mains
                (124, 255, 203), (184, 156, 255), (242, 201, 109) # Accents
            ]
            self.opacity = random.uniform(0.25, 0.75)
            self.blur = random.randint(8, 28)
        else: # dark
            # Main: #19C7BD, #56D6FF, #7CFFCB
            # Accent: #B89CFF, #F2C96D
            colors = [
                (25, 199, 189), (86, 214, 255), (124, 255, 203), # Mains
                (184, 156, 255), (242, 201, 109)                 # Accents
            ]
            self.opacity = random.uniform(0.35, 0.90)
            self.blur = random.randint(10, 34)
            
        self.color = random.choice(colors)
        
        # Sizes
        if self.is_burst:
            self.size = random.randint(2, 6)
            self.theta = random.uniform(0, 2 * math.pi)
            self.vr = random.uniform(2.0, 5.0)  # Speed outward
            self.ar = random.uniform(-0.01, -0.005) # Deceleration
            self.omega = random.uniform(-0.02, 0.02) # Angular swirl
        else: # drift
            self.size = random.randint(4, 12)
            # Choose one of the 3 active zones to spawn
            zone = random.choice(['left', 'right', 'bottom'])
            if zone == 'left':
                self.x0 = random.uniform(0.05 * WIDTH, 0.22 * WIDTH)
                self.y0 = random.uniform(0.10 * HEIGHT, 0.90 * HEIGHT)
            elif zone == 'right':
                self.x0 = random.uniform(0.78 * WIDTH, 0.95 * WIDTH)
                self.y0 = random.uniform(0.10 * HEIGHT, 0.90 * HEIGHT)
            else: # bottom
                self.x0 = random.uniform(0.15 * WIDTH, 0.85 * WIDTH)
                self.y0 = random.uniform(0.65 * HEIGHT, 0.95 * HEIGHT)
                
            self.vx = random.uniform(-0.6, 0.6)
            self.vy = random.uniform(-0.4, 0.4)
            self.amp_x = random.uniform(15.0, 45.0)
            self.amp_y = random.uniform(15.0, 45.0)
            self.freq_x = random.uniform(0.02, 0.04)
            self.freq_y = random.uniform(0.02, 0.04)
            self.phase_x = random.uniform(0, 2 * math.pi)
            self.phase_y = random.uniform(0, 2 * math.pi)
            
        self.pre_render_template()
        
    def pre_render_template(self):
        # Creates a small alpha template with a glowing blurred circle
        margin = int(self.blur * 2.5)
        w = int(self.size + 2 * margin)
        # Ensure w is at least 1
        w = max(1, w)
        img = Image.new("RGBA", (w, w), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw soft outer glow ellipse
        glow_r = self.size + self.blur
        draw.ellipse([
            w//2 - glow_r, w//2 - glow_r,
            w//2 + glow_r, w//2 + glow_r
        ], fill=(self.color[0], self.color[1], self.color[2], int(255 * self.opacity)))
        
        # Apply gaussian blur filter
        img = img.filter(ImageFilter.GaussianBlur(self.blur))
        
        # Draw sharp bright center core
        draw_core = ImageDraw.Draw(img)
        core_r = max(1, self.size // 2)
        draw_core.ellipse([
            w//2 - core_r, w//2 - core_r,
            w//2 + core_r, w//2 + core_r
        ], fill=(self.color[0], self.color[1], self.color[2], int(255 * min(1.0, self.opacity * 1.5))))
        
        self.template = img
        self.template_w = w
        self.template_h = w
        self.mask_channel = img.split()[3]
        
    def get_position(self, age):
        if self.is_burst:
            # Burst math
            r = self.vr * age + 0.5 * self.ar * age * age
            phi = self.theta + self.omega * age
            x = CX + r * math.cos(phi)
            y = CY + r * math.sin(phi)
        else:
            # Drift math
            x = self.x0 + self.vx * age + self.amp_x * math.sin(self.freq_x * age + self.phase_x)
            y = self.y0 + self.vy * age + self.amp_y * math.cos(self.freq_y * age + self.phase_y)
        return x, y
        
    def render(self, frame_img, t):
        # Calculate age with wrap-around
        age = (t - self.T_b) % TOTAL_FRAMES
        if age >= self.L:
            return # Dead
            
        # Position
        x, y = self.get_position(age)
        
        # If way off screen, don't draw
        w_h = self.template_w // 2
        if x < -w_h or x > WIDTH + w_h or y < -w_h or y > HEIGHT + w_h:
            return
            
        # Opacity multiplier based on age (fade in & fade out smoothly)
        t_norm = age / self.L
        fade_factor = math.sin(math.pi * t_norm)
        
        # Safe zone multiplier
        sz_factor = get_safe_zone_factor(x, y)
        
        total_factor = fade_factor * sz_factor
        if total_factor <= 0.001:
            return
            
        # Apply total factor to mask
        lut = [int(p * total_factor) for p in range(256)]
        mask_adjusted = self.mask_channel.point(lut)
        
        # Paste template on frame
        frame_img.paste(self.template, (int(x - w_h), int(y - w_h)), mask_adjusted)

class BackgroundMist:
    def __init__(self, color, size, opacity):
        self.color = color
        self.size = size
        self.opacity = opacity
        self.x_phase = random.uniform(0, 2 * math.pi)
        self.y_phase = random.uniform(0, 2 * math.pi)
        self.speed_x = random.uniform(0.005, 0.015)
        self.speed_y = random.uniform(0.005, 0.015)
        self.amp_x = random.uniform(150.0, 350.0)
        self.amp_y = random.uniform(100.0, 200.0)
        self.pre_render()
        
    def pre_render(self):
        # Create mist radial gradient
        temp_size = 128
        img = Image.new("RGBA", (temp_size, temp_size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        r = temp_size // 3
        draw.ellipse([
            temp_size//2 - r, temp_size//2 - r,
            temp_size//2 + r, temp_size//2 + r
        ], fill=(self.color[0], self.color[1], self.color[2], int(255 * self.opacity)))
        
        img = img.filter(ImageFilter.GaussianBlur(temp_size // 4))
        self.template = img.resize((self.size, self.size), Image.Resampling.BILINEAR)
        self.mask_channel = self.template.split()[3]
        
    def render(self, frame_img, t):
        # Calculate moving center
        cx = WIDTH / 2 + self.amp_x * math.sin(self.speed_x * t + self.x_phase)
        cy = HEIGHT / 2 + self.amp_y * math.cos(self.speed_y * t + self.y_phase)
        
        # Paste mist
        w_h = self.size // 2
        frame_img.paste(self.template, (int(cx - w_h), int(cy - w_h)), self.mask_channel)

def generate_video(mode, output_path):
    print(f"Generating {mode} mode video...")
    
    # Initialize background and particles
    if mode == 'light':
        base_bg = (234, 248, 246, 255) # #EAF8F6
        # Secondary mist: #F7FFFD (RGB 247, 255, 253), very soft opacity
        mist_color = (247, 255, 253)
        mist_count = 3
        mist_size = 800
        mist_opacity = 0.50
        num_burst = 350
        num_drift = 350
    else: # dark
        base_bg = (3, 19, 22, 255) # #031316
        # Secondary gradient: #06272B (RGB 6, 39, 43)
        mist_color = (6, 39, 43)
        mist_count = 4
        mist_size = 1100
        mist_opacity = 0.70
        num_burst = 400
        num_drift = 450
        
    # Create background mist layers
    mists = [BackgroundMist(mist_color, mist_size, mist_opacity) for _ in range(mist_count)]
    
    # Create particles
    particles = []
    # 50% burst particles, 50% ambient drift particles
    for _ in range(num_burst):
        particles.append(Particle(mode, is_burst=True))
    for _ in range(num_drift):
        particles.append(Particle(mode, is_burst=False))
        
    # Ensure parent dir exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Set up imageio writer for H.264 MOV
    writer = imageio.get_writer(output_path, fps=FPS, codec='libx264', quality=9)
        
    # Render loop
    for f in range(TOTAL_FRAMES):
        if f % 30 == 0:
            print(f"Progress: {f}/{TOTAL_FRAMES} frames rendered...")
            
        # Create solid base image
        frame_img = Image.new("RGBA", (WIDTH, HEIGHT), base_bg)
        
        # Render mist
        for mist in mists:
            mist.render(frame_img, f)
            
        # Render particles
        for p in particles:
            p.render(frame_img, f)
            
        # Convert RGBA to RGB for libx264
        frame_rgb = frame_img.convert("RGB")
        frame_np = np.array(frame_rgb)
        
        # Write to video
        writer.append_data(frame_np)
        
    writer.close()
    print(f"Successfully generated: {output_path} ({os.path.getsize(output_path) / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python render_video.py [light|dark] [output_path]")
        sys.exit(1)
        
    mode = sys.argv[1]
    out_path = sys.argv[2]
    generate_video(mode, out_path)
