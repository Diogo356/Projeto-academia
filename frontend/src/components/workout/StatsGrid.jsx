import React from 'react';

const StatsGrid = ({ exercise, workout }) => {
  const stats = [
    {
      label: 'Distância Percorrida',
      value: `${exercise.distance.toFixed(2)} km`,
      icon: '📏',
      color: 'blue'
    },
    {
      label: 'Calorias Queimadas',
      value: `${exercise.calories} kcal`,
      icon: '🔥',
      color: 'red'
    },
    {
      label: 'Frequência Cardíaca',
      value: `${exercise.heartRate} bpm`,
      icon: '💓',
      color: 'pink'
    },
    {
      label: 'Ritmo Médio',
      value: exercise.pace,
      icon: '⏱️',
      color: 'green'
    },
    {
      label: 'Velocidade Atual',
      value: `${exercise.speed} km/h`,
      icon: '🚀',
      color: 'purple'
    },
    {
      label: 'Inclinação',
      value: `${exercise.incline}%`,
      icon: '📈',
      color: 'orange'
    }
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`border rounded-xl p-4 text-center ${getColorClass(stat.color)}`}
        >
          <div className="text-2xl mb-2">{stat.icon}</div>
          <div className="text-lg font-bold mb-1">{stat.value}</div>
          <div className="text-xs font-medium opacity-80">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;