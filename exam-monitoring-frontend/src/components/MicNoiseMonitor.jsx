import { useEffect } from 'react';

const MicNoiseMonitor = ({ onLog }) => {
  useEffect(() => {
    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let rafId;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const detectLoudNoise = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

          // Tune this threshold based on testing
          if (volume > 60) {
            onLog?.({
              type: 'sound_detected',
              volume: volume.toFixed(2),
              message: '🚨 Loud sound or talking detected!',
              timestamp: new Date().toISOString(),
            });
          }

          rafId = requestAnimationFrame(detectLoudNoise);
        };

        detectLoudNoise();
      } catch (err) {
        console.error('Microphone access denied or failed:', err);
        onLog?.({
          type: 'mic_error',
          message: 'Microphone access denied or failed',
          timestamp: new Date().toISOString(),
        });
      }
    };

    startMic();

    return () => {
      cancelAnimationFrame(rafId);
      if (audioContext) audioContext.close();
    };
  }, [onLog]);

  return null; // No UI needed
};

export default MicNoiseMonitor;
