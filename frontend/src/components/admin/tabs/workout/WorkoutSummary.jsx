// src/components/admin/WorkoutSummary.jsx
import React from 'react';

const WorkoutSummary = ({ workoutData }) => {
  const totalDuration = workoutData.totalDuration;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const seconds = totalDuration % 60;

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')} min`;
  };

  return (
    <div className="flex items-center space-x-6 mt-4 lg:mt-0">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{workoutData.exercises.length}</div>
        <div className="text-xs text-gray-600 font-medium">Exercícios</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{formatTime()}</div>
        <div className="text-xs text-gray-600 font-medium">Duração</div>
      </div>
      
      <div className="text-center">
        <div className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
          workoutData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
          workoutData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {workoutData.difficulty}
        </div>
        <div className="text-xs text-gray-600 font-medium mt-1">Nível</div>
      </div>
    </div>
  );
};

export default WorkoutSummary;