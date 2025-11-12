// src/components/workout/TimerDisplay.jsx
import React from 'react';

const TimerDisplay = ({ timeRemaining, formatTime }) => (
  <div className="flex-1 flex flex-col justify-center items-center mb-6 xl:mb-8">
    <div className="text-6xl xl:text-8xl 2xl:text-9xl font-mono font-bold text-blue-600 mb-4 xl:mb-6 text-center">
      {formatTime(timeRemaining)}
    </div>
    <p className="text-lg xl:text-xl 2xl:text-2xl text-gray-600 text-center">
      Tempo Restante deste Exercício
    </p>
  </div>
);

export default TimerDisplay;