import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  light?: boolean; // white text on dark bg
}

export default function AgrovetLogo({ variant = 'full', className = '', light = false }: LogoProps) {
  const textColor = light ? '#ffffff' : '#2D4D28';
  const subColor  = light ? 'rgba(255,255,255,0.8)' : '#5FA30E';

  return (
    <svg
      viewBox={variant === 'full' ? '0 0 180 48' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Agrovet Ltd"
      role="img"
      className={className}
      fill="none"
    >
      {/* Shield base */}
      <path
        d="M24 4 L6 11 L6 26 C6 35.5 14 43 24 46 C34 43 42 35.5 42 26 L42 11 Z"
        fill="#223F21"
      />
      {/* Shield inner highlight */}
      <path
        d="M24 7 L9 13 L9 26 C9 33.8 16 40.2 24 43 C32 40.2 39 33.8 39 26 L39 13 Z"
        fill="#265626"
      />
      {/* Leaf curve inside shield */}
      <path
        d="M24 34 C24 34 14 28 15 19 C16 13 22 11 24 11 C26 11 32 13 33 19 C34 28 24 34 24 34 Z"
        fill="#5FA30E"
        opacity="0.9"
      />
      {/* Leaf vein */}
      <path d="M24 11 L24 34" stroke="#78B534" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Leaf side vein */}
      <path d="M24 18 L20 22 M24 23 L28 19" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" strokeLinecap="round"/>
      {/* Gold accent top */}
      <circle cx="24" cy="8" r="2.5" fill="#F4B943"/>

      {/* Wordmark – only in full variant */}
      {variant === 'full' && (
        <>
          <text
            x="49"
            y="27"
            fontFamily="'Barlow Condensed', sans-serif"
            fontWeight="800"
            fontSize="22"
            fill={textColor}
            letterSpacing="-0.5"
          >
            AGROVET
          </text>
          <text
            x="49"
            y="40"
            fontFamily="'Inter', sans-serif"
            fontWeight="500"
            fontSize="10"
            fill={subColor}
            letterSpacing="2.5"
          >
            LTD · NAIROBI
          </text>
        </>
      )}
    </svg>
  );
}
