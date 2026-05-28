'use client';

import React, { useRef, useState } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'fuchsia';
}

export default function Card({ children, className = '', glowColor = 'purple' }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse position relative to center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Maximum tilt angle (e.g. 10 degrees)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;

    setRotate({ x: rX, y: rY });
    
    // Background glow position relative to the element
    const gX = ((e.clientX - rect.left) / width) * 100;
    const gY = ((e.clientY - rect.top) / height) * 100;
    setGlowPos({ x: gX, y: gY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  // Resolve raw CSS color variable for radial glow spotlight
  const getGlowColorValue = () => {
    switch (glowColor) {
      case 'purple':
        return 'rgba(139, 92, 246, 0.2)';
      case 'blue':
        return 'rgba(59, 130, 246, 0.2)';
      case 'fuchsia':
        return 'rgba(217, 70, 239, 0.2)';
      default:
        return 'rgba(139, 92, 246, 0.2)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 ease-out select-none ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 3D glow spotlight tracker */}
      <div
        className="absolute -inset-px transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(150px circle at ${glowPos.x}% ${glowPos.y}%, ${getGlowColorValue()}, transparent 80%)`,
        }}
      />
      
      {/* Inner offset container that utilizes preserve-3d for floating feeling */}
      <div style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </div>
  );
}
