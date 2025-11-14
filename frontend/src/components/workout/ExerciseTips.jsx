import React from 'react';
import { MdTipsAndUpdates, MdCircle } from 'react-icons/md';

const ExerciseTips = ({ tips, type }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 lg:p-6 h-full">
    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
      <MdTipsAndUpdates className="w-5 h-5 mr-2 text-yellow-500" />
      Dicas do Exercício
      <span className="ml-2 text-sm font-normal text-gray-500 capitalize">
        ({type})
      </span>
    </h3>
    
    {/* ISSO ESTAVA COMENTADO - AGORA ESTÁ CORRIGIDO */}
    <ul className="space-y-3 overflow-y-auto max-h-[300px] lg:max-h-[calc(100%-40px)] pr-2">
      {tips && tips.length > 0 ? (
        tips.map((tip, index) => (
          <li key={index} className="flex items-start text-gray-700 text-sm lg:text-base">
            <MdCircle className="w-3 h-3 mt-1 mr-2 flex-shrink-0 text-yellow-500" />
            <span>{tip}</span>
          </li>
        ))
      ) : (
        <li className="text-gray-500 italic">Nenhuma dica específica disponível.</li>
      )}
    </ul>
  </div>
);

export default ExerciseTips;