// src/components/workout/TipsPanel.jsx
import React from 'react';

const TipsPanel = ({ tips }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 xl:p-6 flex flex-col">
    <h3 className="text-lg xl:text-xl font-semibold text-gray-900 mb-3 xl:mb-4 flex items-center">
      <span className="mr-2">💡</span>
      Dicas do Exercício
    </h3>
    <div className="space-y-2 xl:space-y-3 flex-1 overflow-y-auto">
      {tips?.slice(0, 4).map((tip, index) => (
        <div key={index} className="flex items-start space-x-2 xl:space-x-3">
          <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 bg-blue-500 rounded-full mt-1.5 xl:mt-2 flex-shrink-0"></div>
          <p className="text-sm xl:text-base text-gray-700 leading-relaxed flex-1">{tip}</p>
        </div>
      ))}
    </div>
  </div>
);

export default TipsPanel;