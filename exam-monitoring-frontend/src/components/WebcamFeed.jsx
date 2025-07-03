import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

const WebcamFeed = ({ onLog }) => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [matchStatus, setMatchStatus] = useState('📷 Waiting for face...');
  const [distanceVal, setDistanceVal] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      modelRef.current = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
        }
      );
    };

    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      return new Promise(resolve => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          const checkVideoReady = setInterval(() => {
            if (
              videoRef.current.videoWidth > 0 &&
              videoRef.current.videoHeight > 0
            ) {
              clearInterval(checkVideoReady);
              resolve();
            }
          }, 100);
        };
      });
    };

    const extractDescriptor = async (source) => {
      const faces = await modelRef.current.estimateFaces(source, { flipHorizontal: false });
      if (faces.length > 1) {
        setMatchStatus('🚨 Multiple faces detected!');
        onLog?.({
          type: 'multiple_faces',
          timestamp: new Date().toISOString(),
          count: faces.length,
        });
        return null;
      }

      if (!faces.length) {
        setMatchStatus('❌ No face detected');
        return null;
      }

      const keypoints = faces[0].keypoints;
      const nose = keypoints.find(p => p.name === 'noseTip') || keypoints[Math.floor(keypoints.length / 2)];
      if (!nose) return null;

      const normalized = keypoints.map(p => [p.x - nose.x, p.y - nose.y]).flat();
      return normalized;
    };

    const getEuclideanDistance = (v1, v2) => {
      if (!v1 || !v2 || v1.length !== v2.length) return Infinity;
      return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
    };

    const compareLoop = async () => {
      if (
        !videoRef.current ||
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
      ) {
        return;
      }

      const descriptor = await extractDescriptor(videoRef.current);
      if (!descriptor) return;

      if (!referenceDescriptor) {
        setReferenceDescriptor(descriptor);
        setMatchStatus('✅ Reference face captured');
        onLog?.({ type: 'reference_captured', timestamp: new Date().toISOString() });
        return;
      }

      const distance = getEuclideanDistance(referenceDescriptor, descriptor);
      setDistanceVal(distance);

      const isMatch = distance > 80;
      setMatchStatus(isMatch ? '✅ Same Person' : '🚨 Face Changed!');
      onLog?.({
        type: isMatch ? 'match' : 'mismatch',
        timestamp: new Date().toISOString(),
        distance,
      });
    };

    const init = async () => {
      await loadModel();
      await setupCamera();
      setInterval(compareLoop, 4000); // every 4 seconds
    };

    init();
  }, [referenceDescriptor]);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ border: '2px solid #222', borderRadius: '10px' }}
      />
      <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{matchStatus}</p>
      {distanceVal !== null && (
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Distance: {distanceVal.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default WebcamFeed;
