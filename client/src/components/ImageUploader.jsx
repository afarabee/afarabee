import React, { useRef, useState } from 'react';
import './ImageUploader.css';

function ImageUploader({ onImageSubmit }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      onImageSubmit(preview);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader">
      {preview ? (
        <div className="preview-container">
          <img src={preview} alt="Preview of your LEGO brick" className="preview-image" />
          <div className="preview-actions">
            <button className="big-button identify-button" onClick={handleSubmit}>
              <span className="button-icon">🔍</span>
              Identify My Brick!
            </button>
            <button className="small-button clear-button" onClick={handleClear}>
              Choose Different Photo
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p className="drop-text">
              <strong>Click here</strong> or drag and drop
            </p>
            <p className="drop-hint">JPG, PNG, or GIF (max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="file-input"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
