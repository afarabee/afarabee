import React from 'react';
import './SetsList.css';

function SetsList({ sets, partNumber }) {
  if (!sets || !sets.sets || sets.sets.length === 0) {
    return null;
  }

  return (
    <div className="sets-section">
      <h3 className="sets-title">
        <span className="sets-icon">📦</span>
        LEGO Sets with This Brick
      </h3>
      <p className="sets-subtitle">
        This brick (Part #{partNumber}) appears in these awesome sets!
      </p>

      <div className="sets-grid">
        {sets.sets.slice(0, 6).map((set, index) => (
          <a
            key={index}
            href={set.instructionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="set-card"
          >
            <div className="set-image-container">
              {set.imageUrl ? (
                <img
                  src={set.imageUrl}
                  alt={set.name}
                  className="set-image"
                  loading="lazy"
                />
              ) : (
                <div className="set-placeholder">🧱</div>
              )}
            </div>
            <div className="set-info">
              <h4 className="set-name">{set.name}</h4>
              <div className="set-details">
                <span className="set-number">#{set.setNum}</span>
                <span className="set-year">{set.year}</span>
              </div>
              <div className="set-meta">
                <span className="set-parts">{set.numParts} pieces</span>
                <span className="set-quantity">x{set.quantity} in set</span>
              </div>
            </div>
            <div className="set-link">
              View Instructions →
            </div>
          </a>
        ))}
      </div>

      {sets.count > 6 && (
        <p className="more-sets">
          And {sets.count - 6} more sets use this brick!
        </p>
      )}
    </div>
  );
}

export default SetsList;
