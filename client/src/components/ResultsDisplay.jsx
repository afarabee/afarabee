import React from 'react';
import './ResultsDisplay.css';

function ResultsDisplay({ results }) {
  if (!results.identified) {
    return (
      <div className="results-card not-identified">
        <div className="result-emoji">🤔</div>
        <h2 className="result-title">Hmm, I couldn't find a LEGO brick...</h2>
        <p className="result-message">{results.message}</p>
      </div>
    );
  }

  return (
    <div className="results-display">
      <div className="success-header">
        <span className="success-emoji">🎉</span>
        <h2 className="success-title">Brick Found!</h2>
        <span className="success-emoji">🧱</span>
      </div>

      <div className="bricks-list">
        {results.bricks.map((brick, index) => (
          <div key={index} className="brick-card">
            <div className="brick-header">
              <h3 className="brick-name">{brick.name}</h3>
              <span className={`confidence-badge ${brick.confidence}`}>
                {brick.confidence === 'high' && '⭐ Very Sure!'}
                {brick.confidence === 'medium' && '👍 Pretty Sure'}
                {brick.confidence === 'low' && '🤔 Best Guess'}
              </span>
            </div>

            <div className="brick-details">
              {brick.partNumber && (
                <div className="detail-item">
                  <span className="detail-label">Part Number</span>
                  <span className="detail-value part-number">{brick.partNumber}</span>
                </div>
              )}

              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">{brick.category}</span>
              </div>

              {brick.dimensions && (
                <div className="detail-item">
                  <span className="detail-label">Size</span>
                  <span className="detail-value">{brick.dimensions}</span>
                </div>
              )}

              {brick.color && (
                <div className="detail-item">
                  <span className="detail-label">Color</span>
                  <span className="detail-value color-tag">{brick.color}</span>
                </div>
              )}
            </div>

            <p className="brick-description">{brick.description}</p>

            {brick.funFact && (
              <div className="fun-fact">
                <span className="fun-fact-icon">💡</span>
                <p className="fun-fact-text">
                  <strong>Fun Fact:</strong> {brick.funFact}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {results.suggestions && results.suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3 className="suggestions-title">
            <span className="suggestions-icon">💡</span>
            Build Ideas
          </h3>
          <ul className="suggestions-list">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="suggestion-item">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.message && (
        <div className="friendly-message">
          <p>{results.message}</p>
        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;
