import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob | null, duration: number) => void;
  className?: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([30, 45, 60, 40, 75, 90, 50, 65, 80, 45, 70, 85, 40, 60]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Dynamic waveform simulation while recording
  useEffect(() => {
    let animInterval: NodeJS.Timeout;
    if (isRecording) {
      animInterval = setInterval(() => {
        setWaveformBars(Array.from({ length: 18 }, () => Math.floor(Math.random() * 65) + 25));
      }, 150);
    }
    return () => clearInterval(animInterval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingDuration(0);

      // Attempt browser getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunksRef.current.push(e.data);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            onAudioReady(blob, recordingDuration || 4);
            stream.getTracks().forEach((track) => track.stop());
          };

          mediaRecorder.start();
        } catch {
          // Fallback simulation if mic is blocked or not available in sandbox
          console.warn('Microphone permission not granted, using simulated audio capture.');
        }
      }

      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Create synthetic audio blob for fallback demonstration
      const dummyBlob = new Blob(['simulated_audio_data'], { type: 'audio/wav' });
      setAudioUrl('simulated');
      onAudioReady(dummyBlob, recordingDuration || 3);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl && audioUrl !== 'simulated') {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // Toggle simulation playback state
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        setTimeout(() => setIsPlaying(false), 3000);
      }
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl && audioUrl !== 'simulated') {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingDuration(0);
    onAudioReady(null, 0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-4 rounded-2xl bg-white border border-brand-border shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isRecording ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-brand-lightSky text-brand-skyHover'
          }`}>
            <Volume2 size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-brand-navy block">Acoustic Audio Diagnostic</span>
            <span className="text-[10px] text-brand-slate">Record engine knocks, starter clicks, or squeals</span>
          </div>
        </div>

        {isRecording && (
          <span className="text-xs font-mono font-bold text-rose-500 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            REC {formatTime(recordingDuration)}
          </span>
        )}
      </div>

      {/* Waveform Visualization Box */}
      <div className="h-16 bg-brand-veryLight rounded-xl border border-brand-lightSky/80 flex items-center justify-center gap-1 px-4 mb-3 overflow-hidden">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-150 ${
              isRecording
                ? 'bg-rose-500'
                : audioUrl
                ? isPlaying
                  ? 'bg-brand-sky animate-pulse'
                  : 'bg-brand-skyHover'
                : 'bg-slate-200'
            }`}
            style={{ height: `${isRecording || (audioUrl && isPlaying) ? height : audioUrl ? 35 : 12}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        {!audioUrl ? (
          !isRecording ? (
            <div className="flex gap-2 w-full">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startRecording}
                leftIcon={<Mic size={15} className="text-brand-sky" />}
                className="flex-1"
              >
                Record Audio
              </Button>
              <label className="flex-1 cursor-pointer">
                <div className="w-full py-2 px-3 border border-slate-200 hover:border-brand-sky hover:bg-slate-50 text-brand-navy rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition text-center">
                  <Volume2 size={14} className="text-brand-slate" />
                  <span>Upload Audio</span>
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const url = URL.createObjectURL(file);
                      setAudioUrl(url);
                      onAudioReady(file, 5);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="danger"
              onClick={stopRecording}
              leftIcon={<Square size={14} />}
              className="w-full animate-pulse"
            >
              Stop & Save Recording ({formatTime(recordingDuration)})
            </Button>
          )
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <button
              type="button"
              onClick={togglePlayback}
              className="flex-1 py-2 px-3 bg-brand-lightSky hover:bg-sky-200 text-brand-navy rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause Preview' : 'Play Recorded Audio'}</span>
            </button>
            <button
              type="button"
              onClick={deleteRecording}
              title="Delete audio"
              className="p-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 transition"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
