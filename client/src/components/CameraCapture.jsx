import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css';

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasCamera(true);
    } catch (err) {
      console.error('Camera error:', err);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageData);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!hasCamera) {
    return (
      <div className="camera-error">
        <div className="error-content">
          <span className="error-emoji">📷</span>
          <h3>Camera Not Available</h3>
          <p>Please allow camera access or use the upload option instead.</p>
          <button className="big-button back-button" onClick={handleClose}>
            <span className="button-icon">⬅️</span>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="camera-capture">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {capturedImage ? (
        <div className="captured-preview">
          <img src={capturedImage} alt="Captured LEGO brick" className="captured-image" />
          <div className="capture-actions">
            <button className="big-button identify-button" onClick={handleSubmit}>
              <span className="button-icon">🔍</span>
              Identify This Brick!
            </button>
            <button className="big-button retake-button" onClick={handleRetake}>
              <span className="button-icon">🔄</span>
              Take Another Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />
          <div className="camera-overlay">
            <div className="viewfinder">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <p className="camera-hint">Center your LEGO brick in the frame</p>
          </div>
          <div className="camera-controls">
            <button className="control-button close-btn" onClick={handleClose}>
              ✕
            </button>
            <button className="capture-button" onClick={handleCapture}>
              <span className="capture-inner"></span>
            </button>
            <button className="control-button flip-btn" onClick={toggleCamera}>
              🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
