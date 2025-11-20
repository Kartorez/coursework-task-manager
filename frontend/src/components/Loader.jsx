import React from 'react';
import './Loader.css';

const GradientLoader = ({ size = 60 }) => {
  return (
    <div
      className="gradient-loader"
      style={{ width: size, height: size }}
    ></div>
  );
};

export default GradientLoader;
