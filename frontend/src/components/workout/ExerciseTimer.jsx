import React from 'react';

const ExerciseTimer = ({ time, duration, isRunning, isPaused }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (time / duration) * 100;
  const remainingTime = duration - time;

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="relative w-56 h-56 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isPaused ? "#f59e0b" : "#1e40af"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * progress) / 100}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold font-mono ${
              isPaused ? 'text-yellow-600' : 'text-gray-900'
            }`}>
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Restante: {formatTime(remainingTime)}
            </div>
            <div className={`text-xs font-semibold mt-2 px-3 py-1 rounded-full ${
              isRunning ? 'bg-green-100 text-green-700' : 
              isPaused ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {!isRunning && !isPaused ? 'AGUARDANDO' : 
               isPaused ? 'PAUSADO' : 'EM EXECUÇÃO'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;