import React, { useState } from 'react';
import './BatchResultsDisplay.css';

function BatchResultsDisplay({ results, onSelectBrick }) {
  const [expandedBrick, setExpandedBrick] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  if (!results.identified) {
    return (
      <div className="results-card not-identified">
        <div className="result-emoji">🤔</div>
        <h2 className="result-title">Hmm, I couldn't identify the bricks...</h2>
        <p className="result-message">{results.message}</p>
      </div>
    );
  }

  const categories = results.categories || {};
  const categoryList = Object.entries(categories)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const filteredBricks = filterCategory === 'all'
    ? results.bricks
    : results.bricks.filter(brick =>
        brick.category?.toLowerCase().includes(filterCategory.toLowerCase())
      );

  return (
    <div className="batch-results-display">
      {/* Header */}
      <div className="batch-header">
        <span className="batch-emoji">📦</span>
        <div className="batch-title-section">
          <h2 className="batch-title">Collection Scanned!</h2>
          <p className="batch-subtitle">
            Found approximately <strong>{results.totalPiecesEstimate || 'many'}</strong> pieces
          </p>
        </div>
        <span className="batch-emoji">🔍</span>
      </div>

      {/* Category Summary */}
      {categoryList.length > 0 && (
        <div className="category-summary">
          <h3 className="summary-title">
            <span>📊</span> What's in your collection
          </h3>
          <div className="category-pills">
            <button
              className={`category-pill ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All ({results.bricks.length})
            </button>
            {categoryList.map(([category, count]) => (
              <button
                key={category}
                className={`category-pill ${filterCategory === category ? 'active' : ''}`}
                onClick={() => setFilterCategory(category)}
              >
                {category} ({count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interesting Finds */}
      {results.interestingFinds && results.interestingFinds.length > 0 && (
        <div className="interesting-finds">
          <h3 className="finds-title">
            <span>✨</span> Interesting Finds!
          </h3>
          <ul className="finds-list">
            {results.interestingFinds.map((find, index) => (
              <li key={index} className="find-item">{find}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Brick Grid */}
      <div className="brick-grid">
        {filteredBricks.map((brick, index) => (
          <div
            key={index}
            className={`batch-brick-card ${expandedBrick === index ? 'expanded' : ''}`}
            onClick={() => setExpandedBrick(expandedBrick === index ? null : index)}
          >
            <div className="batch-brick-header">
              <span className={`mini-confidence ${brick.confidence}`}>
                {brick.confidence === 'high' && '⭐'}
                {brick.confidence === 'medium' && '👍'}
                {brick.confidence === 'low' && '🤔'}
              </span>
              <h4 className="batch-brick-name">{brick.name}</h4>
            </div>

            <div className="batch-brick-quick-info">
              {brick.dimensions && (
                <span className="quick-tag dimensions">{brick.dimensions}</span>
              )}
              {brick.color && (
                <span className="quick-tag color">{brick.color}</span>
              )}
              {brick.approximateCount && (
                <span className="quick-tag count">×{brick.approximateCount}</span>
              )}
            </div>

            {expandedBrick === index && (
              <div className="batch-brick-details">
                {brick.partNumber && (
                  <div className="detail-row">
                    <span className="detail-label">Part #</span>
                    <span className="detail-value part-num">{brick.partNumber}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{brick.category}</span>
                </div>
                <p className="batch-brick-description">{brick.description}</p>

                {brick.partNumber && (
                  <button
                    className="find-sets-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBrick(brick);
                    }}
                  >
                    <span>🔎</span> Find Sets with This Brick
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Build Suggestions */}
      {results.suggestions && results.suggestions.length > 0 && (
        <div className="batch-suggestions">
          <h3 className="suggestions-title">
            <span>💡</span> Build Ideas for Your Collection
          </h3>
          <ul className="batch-suggestions-list">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="batch-suggestion-item">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friendly Message */}
      {results.message && (
        <div className="batch-message">
          <p>{results.message}</p>
        </div>
      )}
    </div>
  );
}

export default BatchResultsDisplay;
