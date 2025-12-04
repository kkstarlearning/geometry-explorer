import React from 'react';

const GridBackground: React.FC = () => {
  return (
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
    </pattern>
  );
};

export default GridBackground;