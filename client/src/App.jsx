import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import CameraCapture from './components/CameraCapture';
import ResultsDisplay from './components/ResultsDisplay';
import SetsList from './components/SetsList';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [sets, setSets] = useState(null);

  const handleImageSubmit = async (imageData) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSets(null);
    setSelectedPart(null);

    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: imageData }),
      });

      if (!response.ok) {
        throw new Error('Failed to identify brick');
      }

      const data = await response.json();
      setResults(data);

      // If we identified a brick with a part number, fetch sets
      if (data.identified && data.bricks?.[0]?.partNumber) {
        fetchSets(data.bricks[0].partNumber);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong! Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSets = async (partNumber) => {
    try {
      const response = await fetch(`/api/parts/${partNumber}/sets`);
      if (response.ok) {
        const data = await response.json();
        setSets(data);
        setSelectedPart(partNumber);
      }
    } catch (err) {
      console.error('Failed to fetch sets:', err);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setSets(null);
    setSelectedPart(null);
    setShowCamera(false);
  };

  return (
    <div className="app">
      <div className="brick-decorations">
        <div className="floating-brick brick-1"></div>
        <div className="floating-brick brick-2"></div>
        <div className="floating-brick brick-3"></div>
        <div className="floating-brick brick-4"></div>
      </div>

      <Header />

      <main className="main-content">
        {isLoading ? (
          <LoadingSpinner />
        ) : results ? (
          <div className="results-container">
            <ResultsDisplay results={results} />
            {sets && sets.sets?.length > 0 && (
              <SetsList sets={sets} partNumber={selectedPart} />
            )}
            <button className="big-button reset-button" onClick={handleReset}>
              <span className="button-icon">🔄</span>
              Try Another Brick!
            </button>
          </div>
        ) : (
          <div className="upload-section">
            <h2 className="section-title">
              Take a photo or upload a picture of your LEGO brick!
            </h2>

            <div className="upload-options">
              {showCamera ? (
                <CameraCapture
                  onCapture={handleImageSubmit}
                  onClose={() => setShowCamera(false)}
                />
              ) : (
                <>
                  <button
                    className="big-button camera-button"
                    onClick={() => setShowCamera(true)}
                  >
                    <span className="button-icon">📸</span>
                    Take a Photo
                  </button>

                  <div className="divider">
                    <span>OR</span>
                  </div>

                  <ImageUploader onImageSubmit={handleImageSubmit} />
                </>
              )}
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">😕</span>
                {error}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Made with ❤️ for Papa and all LEGO lovers!</p>
        <p className="footer-small">
          Powered by Anthropic Vision AI & Rebrickable
        </p>
      </footer>
    </div>
  );
}

export default App;
