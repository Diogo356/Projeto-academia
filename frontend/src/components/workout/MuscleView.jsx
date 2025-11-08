// src/components/workout/MuscleView.jsx
import React, { useState } from 'react';

const MuscleView = ({ exercise }) => {
  const [view, setView] = useState('front');

  return (
    <div className="bg-white rounded-2xl p-4">
      <h3 className="text-center mb-2">Anatomia</h3>
      
      {/* SVG MÍNIMO - apenas contorno do corpo */}
      <div className="flex justify-center">
        <svg width="120" height="180" viewBox="0 0 100 150">
          {/* Corpo simples */}
          <path
            d="M 50,20 C 40,20 25,30 25,50 C 25,70 30,80 35,100 C 40,120 35,140 40,150 C 45,155 55,155 60,150 C 65,140 60,120 65,100 C 70,80 75,70 75,50 C 75,30 60,20 50,20 Z"
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* Quadríceps destacado */}
          <path
            d="M 35,100 L 30,120 L 40,125 L 45,105 Z M 65,100 L 70,120 L 60,125 L 55,105 Z"
            fill="#3b82f6"
            stroke="#1d4ed8"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Controles mínimos */}
      <div className="flex justify-center space-x-2 mt-2">
        <button
          onClick={() => setView('front')}
          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Frente
        </button>
        <button
          onClick={() => setView('back')}
          className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
        >
          Costas
        </button>
      </div>

      <div className="text-center mt-1">
        <span className="text-xs text-gray-600">Quadríceps</span>
      </div>
    </div>
  );
};

export default MuscleView;