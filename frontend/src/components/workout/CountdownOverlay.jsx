// src/components/workout/CountdownOverlay.jsx
import React from 'react';

const CountdownOverlay = ({ show, countdown }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="text-8xl font-bold mb-2">{countdown}</div>
        <p className="text-xl">Preparando seu treino...</p>
        <p className="text-gray-300 mt-2">O treino começará automaticamente</p>
      </div>
    </div>
  );
};

export default CountdownOverlay;