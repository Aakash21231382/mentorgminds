import React from 'react';
import '../assets/css/PageLoader.css';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="pl-overlay">
      <div className="pl-box">
        <div className="pl-spinner" />
        <p className="pl-message">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
