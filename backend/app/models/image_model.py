import io
import cv2
import numpy as np
from PIL import Image
from typing import Dict, Tuple, List, Any, Optional

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

    Visual Feature Pipeline:
    1. Image Decoding: Decodes in-memory image bytes (JPEG, PNG, WebP) into BGR numpy arrays.
    2. Color Space Conversion: Maps BGR to HSV (Hue-Saturation-Value) for robust illumination-invariant color segmentation.
    3. Warning Indicator Detection:
       - Amber Luminous Mask (H: 10-25, S: 100-255, V: 100-255): Detects check-engine, battery, and electrical malfunction lamps.
       - Red Luminous Mask (H: 0-10 & 160-180): Detects critical brake, oil pressure, and coolant over-temperature indicators.
    4. Structural Edge Gradient Analysis: Applies Canny edge detector (thresholds 100/200) on grayscale conversion
       to measure edge density, isolating tyre tread wear, cracked belts, or scored brake rotors.
    5. Luminance & Contrast: Computes mean brightness and standard deviation to detect dark localized fluid seepage or soot.
    """
    def __init__(self):
        self.is_prototype = True
        self.classes_ = CATEGORIES

    def extract_visual_features(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Decodes image bytes and extracts computer vision attributes using OpenCV.

        Args:
            image_bytes: Raw binary image payload.

        Returns:
            Dict containing dimensions, edge density, warning color ratios, and luminance metrics.
        """
        try:
            # Decode image from byte buffer into OpenCV BGR matrix
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {"error": "Invalid image format", "success": False}

            height, width, channels = img.shape
            
            # 1. Color Space Conversions
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # 2. Amber Warning Light Mask (Check Engine / Battery / ABS)
            lower_amber = np.array([10, 100, 100])
            upper_amber = np.array([25, 255, 255])
            amber_mask = cv2.inRange(hsv, lower_amber, upper_amber)
            amber_ratio = float(np.sum(amber_mask > 0) / (height * width))

            # Red Warning Light Mask (Brake failure, Coolant overheat, Oil alert)
            lower_red1 = np.array([0, 100, 100])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([160, 100, 100])
            upper_red2 = np.array([180, 255, 255])
            red_mask = cv2.bitwise_or(
                cv2.inRange(hsv, lower_red1, upper_red1),
                cv2.inRange(hsv, lower_red2, upper_red2)
            )
            red_ratio = float(np.sum(red_mask > 0) / (height * width))

            # 3. Structural Edge / Texture Density (Tyre tread degradation, brake rotor scoring)
            edges = cv2.Canny(gray, 100, 200)
            edge_density = float(np.sum(edges > 0) / (height * width))

            # 4. Brightness & Contrast (Fluid leaks, soot build-up)
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
        Performs visual feature extraction and maps visual patterns to fault candidate categories.

        Args:
            image_bytes: Raw binary image payload.

        Returns:
            - Dict mapping fault category to normalized probability [0.0 - 1.0].
            - List of visual evidence strings.
            - Raw extracted visual features dictionary.
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

        # Normalize probabilities to strictly sum to 1.0
        total = sum(probs.values())
        norm_probs = {k: round(v / total, 4) for k, v in probs.items()}

        return norm_probs, evidence, features
