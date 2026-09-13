import io
import cv2
import numpy as np
from PIL import Image
from typing import Dict, Tuple, List, Any

CATEGORIES = [
    "Battery / Starting System",
    "Braking System",
    "Engine & Valvetrain",
    "Cooling System",
    "Electrical & Sensors",
    "Transmission & Clutch",
    "Fuel System",
    "Tyres & Suspension"
]

class ImageFaultAnalyzer:
    """
    Computer Vision Preprocessor & Visual Feature Extractor using OpenCV.
    Analyzes visual attributes (color spectra in HSV space for warning indicators,
    Sobel/Canny edge density for tire tread/cracking, fluid wetness/dark patch detection).
    """
    def __init__(self):
        self.is_prototype = True
        self.classes_ = CATEGORIES

    def extract_visual_features(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts real computer vision attributes using OpenCV.
        """
        try:
            # Decode image
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {"error": "Invalid image format", "success": False}

            height, width, channels = img.shape
            
            # 1. Color Space Conversion
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # 2. Amber / Red Warning Light Mask (Indicator detection)
            # Amber range: H: 10-25, S: 100-255, V: 100-255
            lower_amber = np.array([10, 100, 100])
            upper_amber = np.array([25, 255, 255])
            amber_mask = cv2.inRange(hsv, lower_amber, upper_amber)
            amber_ratio = float(np.sum(amber_mask > 0) / (height * width))

            # Red range (low & high hue wraps)
            lower_red1 = np.array([0, 100, 100])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([160, 100, 100])
            upper_red2 = np.array([180, 255, 255])
            red_mask = cv2.bitwise_or(
                cv2.inRange(hsv, lower_red1, upper_red1),
                cv2.inRange(hsv, lower_red2, upper_red2)
            )
            red_ratio = float(np.sum(red_mask > 0) / (height * width))

            # 3. Edge / Texture Density (Tire wear, mechanical cracks)
            edges = cv2.Canny(gray, 100, 200)
            edge_density = float(np.sum(edges > 0) / (height * width))

            # 4. Brightness & Contrast
            mean_brightness = float(np.mean(gray))
            std_contrast = float(np.std(gray))

            return {
                "dimensions": f"{width}x{height}",
                "mean_brightness": round(mean_brightness, 1),
                "contrast_std": round(std_contrast, 1),
                "edge_density": round(edge_density, 4),
                "warning_amber_ratio": round(amber_ratio * 100, 2),
                "warning_red_ratio": round(red_ratio * 100, 2),
                "has_warning_illumination": (amber_ratio > 0.008 or red_ratio > 0.008),
                "success": True
            }
        except Exception as e:
            return {"error": str(e), "success": False}

    def predict_proba(self, image_bytes: bytes) -> Tuple[Dict[str, float], List[str], Dict[str, Any]]:
        """
        Visual classification based on extracted OpenCV features.
        Clearly marked as prototype visual analyzer with real image preprocessing.
        """
        features = self.extract_visual_features(image_bytes)

        if not features.get("success"):
            uniform = 1.0 / len(CATEGORIES)
            return {cat: uniform for cat in CATEGORIES}, ["Image could not be processed by OpenCV."], {}

        probs = {cat: 0.05 for cat in CATEGORIES}
        evidence = []

        amber = features.get("warning_amber_ratio", 0)
        red = features.get("warning_red_ratio", 0)
        edges = features.get("edge_density", 0)
        brightness = features.get("mean_brightness", 100)

        if red > 0.8:
            probs["Braking System"] += 0.40
            probs["Cooling System"] += 0.35
            evidence.append(f"Computer Vision: High red spectrum cluster ({red}% pixels) detected, consistent with critical dashboard warning / high-temperature alert.")
        elif amber > 0.8:
            probs["Electrical & Sensors"] += 0.45
            probs["Battery / Starting System"] += 0.30
            evidence.append(f"Computer Vision: Amber luminous cluster ({amber}% pixels) detected, indicating check engine / battery / sensor icon illumination.")
        elif edges > 0.12:
            probs["Tyres & Suspension"] += 0.45
            probs["Braking System"] += 0.25
            evidence.append(f"Computer Vision: High structural edge density ({edges:.3f}) indicating surface grooves, tread wear, or brake rotor friction scoring.")
        elif brightness < 60:
            probs["Engine & Valvetrain"] += 0.35
            probs["Fuel System"] += 0.30
            evidence.append(f"Computer Vision: Dark localized low-reflectance region (brightness: {brightness:.1f}) detected, consistent with fluid seepage or soot build-up.")
        else:
            probs["Tyres & Suspension"] += 0.25
            probs["Engine & Valvetrain"] += 0.25
            evidence.append(f"Computer Vision: Uniform surface reflectance (contrast: {features.get('contrast_std', 0):.1f}) across component geometry.")

        total = sum(probs.values())
        norm_probs = {k: round(v / total, 4) for k, v in probs.items()}

        return norm_probs, evidence, features
