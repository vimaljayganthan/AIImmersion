import io
import os
import numpy as np
from typing import Dict, Tuple, List, Any, Optional

try:
    import librosa
    import soundfile as sf
    AUDIO_AVAILABLE = True
except ImportError:
    AUDIO_AVAILABLE = False

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

class AudioFaultAnalyzer:
    """
    Acoustic Feature Extraction and Fault Classifier for Engine & Mechanical Sounds.

    Acoustic Feature Pipeline:
    1. Audio Loading: Decodes in-memory audio byte stream (WAV, MP3, WebM) resampled to 22,050 Hz.
    2. MFCCs (13 Coefficients): Extracts Mel-Frequency Cepstral Coefficients capturing the spectral
       envelope and harmonic timbre of mechanical resonances.
    3. Spectral Centroid: Computes the 'brightness' or center of gravity of the sound frequency spectrum.
       High centroids (>2600 Hz) correlate with metal-on-metal friction or belt squeal.
       Low centroids (<1300 Hz) correlate with starter clicks or low-rpm rumble.
    4. Spectral Bandwidth: Measures frequency spread around the centroid.
    5. Zero Crossing Rate (ZCR): Measures rate of sign-changes in the signal, indicating noisiness/hiss.
    6. Root-Mean-Square (RMS) Energy: Measures signal power to isolate high-energy percussive knocking.
    """
    def __init__(self):
        self.is_prototype = True
        self.classes_ = CATEGORIES

    def extract_features(self, audio_bytes: bytes) -> Dict[str, Any]:
        """
        Loads audio from bytes and extracts acoustic signal descriptors using librosa.

        Args:
            audio_bytes: Raw audio binary data.

        Returns:
            Dict containing computed signal metrics (duration, RMS, ZCR, Spectral Centroid, MFCC summary).
        """
        if not AUDIO_AVAILABLE:
            return {"error": "librosa / soundfile not installed in Python environment.", "success": False}

        try:
            # Load audio buffer using librosa / soundfile
            bio = io.BytesIO(audio_bytes)
            y, sr = librosa.load(bio, sr=22050, duration=10.0)
            
            if len(y) == 0:
                return {"error": "Empty audio data", "success": False}

            # 1. MFCCs (13 coefficients for spectral envelope representation)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_means = [float(np.mean(m)) for m in mfccs]
            
            # 2. RMS Energy (percussive combustion / mechanical power)
            rms = librosa.feature.rms(y=y)
            rms_mean = float(np.mean(rms))
            
            # 3. Zero Crossing Rate (high frequency noise / friction screech)
            zcr = librosa.feature.zero_crossing_rate(y)
            zcr_mean = float(np.mean(zcr))
            
            # 4. Spectral Centroid (frequency center of mass in Hz)
            spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            centroid_mean = float(np.mean(spectral_centroid))
            
            # 5. Spectral Bandwidth (spectral dispersion in Hz)
            spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            bandwidth_mean = float(np.mean(spectral_bandwidth))
            
            duration = float(librosa.get_duration(y=y, sr=sr))

            return {
                "duration_seconds": round(duration, 2),
                "sampling_rate": sr,
                "rms_energy": round(rms_mean, 4),
                "zero_crossing_rate": round(zcr_mean, 4),
                "spectral_centroid_hz": round(centroid_mean, 1),
                "spectral_bandwidth_hz": round(bandwidth_mean, 1),
                "mfcc_summary": [round(val, 2) for val in mfcc_means[:5]],
                "success": True
            }
        except Exception as e:
            return {"error": str(e), "success": False}

    def predict_proba(self, audio_bytes: bytes) -> Tuple[Dict[str, float], List[str], Dict[str, Any]]:
        """
        Performs acoustic feature extraction and classifies mechanical sounds based on acoustic signatures.

        Acoustic heuristics based on physical automotive sound profiles:
        - High ZCR & high centroid (>2600 Hz): high-pitch screeching -> Braking System or Cooling fan belt slip.
        - Low centroid (<1300 Hz) with low RMS: solenoid clicks / weak crank harmonics -> Battery / Starting System.
        - High RMS (>0.15): high mechanical energy / combustion tapping -> Engine & Valvetrain or Transmission.
        - Moderate centroid (1400-2400 Hz): rotational mechanical frequencies -> Engine / Transmission.

        Args:
            audio_bytes: Raw audio binary data.

        Returns:
            - Dict mapping fault category to normalized probability [0.0 - 1.0].
            - List of acoustic evidence strings.
            - Raw extracted acoustic features dictionary.
        """
        features = self.extract_features(audio_bytes)
        
        if not features.get("success"):
            # Fallback uniform distribution if extraction fails
            uniform = 1.0 / len(CATEGORIES)
            return {cat: uniform for cat in CATEGORIES}, ["Audio file unreadable or corrupt."], {}

        zcr = features.get("zero_crossing_rate", 0.05)
        centroid = features.get("spectral_centroid_hz", 1500.0)
        rms = features.get("rms_energy", 0.05)
        
        probs = {cat: 0.05 for cat in CATEGORIES}
        evidence = []

        if centroid > 2600 or zcr > 0.12:
            probs["Braking System"] += 0.55
            probs["Cooling System"] += 0.20
            evidence.append(f"Acoustic analysis: High-frequency spectral energy ({centroid:.0f} Hz, ZCR: {zcr:.3f}) matches friction squeal / belt slip characteristics.")
        elif centroid < 1300 and rms < 0.08:
            probs["Battery / Starting System"] += 0.60
            probs["Electrical & Sensors"] += 0.15
            evidence.append(f"Acoustic analysis: Low-energy clicks and weak crank harmonics ({centroid:.0f} Hz) indicate solenoid chatter or insufficient starter torque.")
        elif rms > 0.15:
            probs["Engine & Valvetrain"] += 0.50
            probs["Transmission & Clutch"] += 0.20
            evidence.append(f"Acoustic analysis: High mechanical energy (RMS: {rms:.3f}, Centroid: {centroid:.0f} Hz) indicates combustion misfire or internal mechanical tapping.")
        else:
            probs["Engine & Valvetrain"] += 0.30
            probs["Transmission & Clutch"] += 0.30
            evidence.append(f"Acoustic analysis: Moderate spectral distribution ({centroid:.0f} Hz, RMS: {rms:.3f}) across mechanical rotational frequencies.")

        # Normalize probabilities so they strictly sum to 1.0
        total = sum(probs.values())
        norm_probs = {k: round(v / total, 4) for k, v in probs.items()}

        return norm_probs, evidence, features
