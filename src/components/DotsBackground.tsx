import React from 'react';

const DotsBackground = ({ className = '', color = '#a78bfa', opacity = 0.13, style = {} }) => (
  <svg
    className={className}
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, ...style }}
    width="100%"
    height="100%"
    aria-hidden="true"
  >
    <defs>
      <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill={color} fillOpacity={opacity} />
        <circle cx="30" cy="10" r="0.7" fill={color} fillOpacity={opacity} />
        <circle cx="20" cy="30" r="0.6" fill={color} fillOpacity={opacity} />
        <circle cx="35" cy="35" r="0.8" fill={color} fillOpacity={opacity} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

export default DotsBackground; 