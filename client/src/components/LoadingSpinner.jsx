import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  const messages = [
    "Looking at your brick...",
    "Searching the LEGO database...",
    "Almost there...",
    "This is exciting!",
  ];

  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-bricks">
        <div className="loading-brick red"></div>
        <div className="loading-brick yellow"></div>
        <div className="loading-brick blue"></div>
        <div className="loading-brick green"></div>
      </div>
      <h2 className="loading-title">Analyzing Your Brick!</h2>
      <p className="loading-message">{messages[messageIndex]}</p>
      <div className="loading-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
