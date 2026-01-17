import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <div className="logo-brick">
            <div className="stud"></div>
            <div className="stud"></div>
          </div>
          <h1 className="logo-text">
            Papa's<br />
            <span className="logo-highlight">Brick Builder</span>
          </h1>
          <div className="logo-brick">
            <div className="stud"></div>
            <div className="stud"></div>
          </div>
        </div>
        <p className="tagline">Snap a photo and discover your LEGO bricks!</p>
      </div>
      <div className="header-decoration">
        <div className="deco-brick red"></div>
        <div className="deco-brick yellow"></div>
        <div className="deco-brick blue"></div>
        <div className="deco-brick green"></div>
        <div className="deco-brick orange"></div>
      </div>
    </header>
  );
}

export default Header;
