// For PNG/JPG, this is correct:
declare module '*.png' {
  const content: number;
  export default content;
}

declare module '*.jpg' {
  const content: number;
  export default content;
}

// For SVG, this is how it should be:
// It indicates that importing an SVG file gives you a React component
// that accepts props from 'react-native-svg'.
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>; // <--- THIS IS THE KEY CHANGE
  export default content;
}