// import React, { useState } from 'react';

// const CustomMuscleView = ({ exercise, className = '' }) => {
//   const [view, setView] = useState('front');

//   // Mapeamento de exercícios para músculos
//   const getMusclesForExercise = () => {
//     const exerciseMap = {
//       'Esteira Profissional': ['quads', 'calves', 'glutes', 'hamstrings'],
//       'Bicicleta Ergométrica': ['quads', 'calves', 'glutes'],
//       'Elíptico': ['quads', 'calves', 'glutes', 'hamstrings', 'shoulders'],
//       'Remo': ['back', 'shoulders', 'biceps', 'traps', 'triceps'],
//       'Supino Reto': ['chest', 'shoulders', 'triceps'],
//       'Agachamento Livre': ['quads', 'glutes', 'hamstrings', 'calves'],
//       'Leg Press': ['quads', 'glutes'],
//       'Puxada Alta': ['back', 'shoulders', 'biceps'],
//       'Rosca Direta': ['biceps', 'forearms'],
//       'Tríceps Corda': ['triceps'],
//       'Abdominal Crunch': ['abs'],
//       'Elevação Pélvica': ['glutes', 'hamstrings']
//     };

//     return exerciseMap[exercise.name] || [];
//   };

//   // Descrições dos músculos
//   const getMuscleDescriptions = () => {
//     const descriptions = {
//       'quads': 'Quadríceps (Coxa Frontal)',
//       'glutes': 'Glúteos',
//       'hamstrings': 'Posterior da Coxa',
//       'calves': 'Panturrilhas',
//       'back': 'Costas/Dorsais',
//       'shoulders': 'Ombros',
//       'chest': 'Peitoral',
//       'biceps': 'Bíceps',
//       'triceps': 'Tríceps',
//       'traps': 'Trapézios',
//       'forearms': 'Antebraços',
//       'abs': 'Abdominais'
//     };

//     const activeMuscles = getMusclesForExercise();
//     return activeMuscles.map(muscle => ({
//       name: muscle,
//       description: descriptions[muscle] || muscle,
//       color: getMuscleColor(muscle)
//     }));
//   };

//   const getMuscleColor = (muscle) => {
//     const colors = {
//       'quads': '#8b5cf6',      // Roxo
//       'glutes': '#a855f7',     // Roxo claro
//       'hamstrings': '#ec4899', // Rosa
//       'calves': '#f472b6',     // Rosa claro
//       'back': '#dc2626',       // Vermelho
//       'shoulders': '#3b82f6',  // Azul
//       'chest': '#ef4444',      // Vermelho claro
//       'biceps': '#f59e0b',     // Amarelo
//       'triceps': '#fbbf24',    // Amarelo claro
//       'traps': '#0ea5e9',      // Azul claro
//       'forearms': '#d97706',   // Laranja
//       'abs': '#10b981'         // Verde
//     };
//     return colors[muscle] || '#6b7280';
//   };

//   // Dicas de execução
//   const getExerciseTip = () => {
//     const tips = {
//       'Esteira Profissional': 'Mantenha a postura ereta, olhe para frente e mantenha passos ritmados. Hidrate-se regularmente durante o exercício.',
//       'Bicicleta Ergométrica': 'Ajuste o banco na altura do quadril para evitar lesões nos joelhos. Mantenha um ritmo constante.',
//       'Elíptico': 'Use os braços para maior engajamento cardiovascular. Mantenha os pés firmes nos pedais.',
//       'Remo': 'Mantenha as costas retas, puxe com as costas primeiro e depois os braços. Evite arquear a coluna.',
//       'Supino Reto': 'Contraia o core, mantenha ombros estáveis e desça controladamente. Não trave os cotovelos.',
//       'Agachamento Livre': 'Mantenha o peito erguido e desça como se fosse sentar em uma cadeira. Joelhos não devem passar dos pés.',
//       'Leg Press': 'Posicione os pés na largura dos ombros. Não trave os joelhos no final do movimento.',
//       'Puxada Alta': 'Puxe a barra em direção ao peito, mantendo o tronco estável. Evite balançar o corpo.',
//       'Rosca Direta': 'Mantenha os cotovelos fixos ao lado do corpo. Contraia o bíceps no topo do movimento.',
//       'Tríceps Corda': 'Mantenha os cotovelos próximos ao corpo. Estenda os braços completamente.',
//       'Abdominal Crunch': 'Mantenha o pescoço relaxado, focando na contração abdominal. Evite puxar a cabeça com as mãos.',
//       'Elevação Pélvica': 'Contraia os glúteos no topo do movimento. Mantenha o abdômen contraído.'
//     };
//     return tips[exercise.name] || 'Execute o movimento com controle, focando na técnica correta e na amplitude completa.';
//   };

//   const activeMuscles = getMusclesForExercise();
//   const muscleDescriptions = getMuscleDescriptions();
//   const exerciseTip = getExerciseTip();

//   // SVG customizado para anatomia
//   const AnatomySVG = ({ view, activeMuscles }) => {
//     const frontMuscles = {
//       chest: { 
//         path: "M 30,70 L 45,75 L 55,75 L 70,70 L 65,85 L 35,85 Z", 
//         color: "#ef4444",
//         name: "Peitoral"
//       },
//       shoulders: { 
//         path: "M 25,65 L 30,70 L 30,80 L 25,75 Z M 75,65 L 70,70 L 70,80 L 75,75 Z", 
//         color: "#3b82f6",
//         name: "Ombros"
//       },
//       biceps: { 
//         path: "M 30,80 L 25,95 L 35,100 L 40,85 Z M 70,80 L 75,95 L 65,100 L 60,85 Z", 
//         color: "#f59e0b",
//         name: "Bíceps"
//       },
//       abs: { 
//         path: "M 40,85 L 45,90 L 55,90 L 60,85 L 55,100 L 45,100 Z", 
//         color: "#10b981",
//         name: "Abdominais"
//       },
//       quads: { 
//         path: "M 35,100 L 30,120 L 40,125 L 45,105 Z M 65,100 L 70,120 L 60,125 L 55,105 Z", 
//         color: "#8b5cf6",
//         name: "Quadríceps"
//       },
//       calves: { 
//         path: "M 33,125 L 30,140 L 38,145 L 41,130 Z M 67,125 L 70,140 L 62,145 L 59,130 Z", 
//         color: "#ec4899",
//         name: "Panturrilhas"
//       }
//     };

//     const backMuscles = {
//       back: { 
//         path: "M 30,65 L 50,75 L 70,65 L 65,100 L 35,100 Z", 
//         color: "#dc2626",
//         name: "Costas"
//       },
//       traps: { 
//         path: "M 40,60 L 35,65 L 50,70 L 65,65 L 60,60 Z", 
//         color: "#0ea5e9",
//         name: "Trapézios"
//       },
//       triceps: { 
//         path: "M 28,80 L 25,95 L 32,100 L 35,85 Z M 72,80 L 75,95 L 68,100 L 65,85 Z", 
//         color: "#fbbf24",
//         name: "Tríceps"
//       },
//       glutes: { 
//         path: "M 35,100 L 33,115 L 42,120 L 45,105 Z M 65,100 L 67,115 L 58,120 L 55,105 Z", 
//         color: "#a855f7",
//         name: "Glúteos"
//       },
//       hamstrings: { 
//         path: "M 33,115 L 30,130 L 38,135 L 41,120 Z M 67,115 L 70,130 L 62,135 L 59,120 Z", 
//         color: "#f472b6",
//         name: "Posterior"
//       }
//     };

//     const muscles = view === 'front' ? frontMuscles : backMuscles;

//     return (
//       <div className="flex flex-col items-center">
//         <svg width="200" height="250" viewBox="0 0 100 150" className="mx-auto">
//           {/* Contorno do corpo */}
//           <path
//             d="M 50,20 C 40,20 25,30 25,50 C 25,70 30,80 35,100 C 40,120 35,140 40,150 C 45,155 55,155 60,150 C 65,140 60,120 65,100 C 70,80 75,70 75,50 C 75,30 60,20 50,20 Z"
//             fill="#f8fafc"
//             stroke="#e2e8f0"
//             strokeWidth="1.5"
//           />
          
//           {/* Músculos */}
//           {Object.entries(muscles).map(([muscle, data]) => (
//             <path
//               key={muscle}
//               d={data.path}
//               fill={activeMuscles.includes(muscle) ? data.color : "#e5e7eb"}
//               stroke={activeMuscles.includes(muscle) ? "#374151" : "transparent"}
//               strokeWidth="0.8"
//               className="transition-all duration-300 cursor-pointer hover:opacity-90"
//             />
//           ))}
//         </svg>
//       </div>
//     );
//   };

//   return (
//     <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">
//           🎯 Anatomia do Exercício
//         </h3>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setView('front')}
//             className={`btn btn-sm ${view === 'front' ? 'btn-primary' : 'btn-outline'}`}
//           >
//             Frente
//           </button>
//           <button
//             onClick={() => setView('back')}
//             className={`btn btn-sm ${view === 'back' ? 'btn-primary' : 'btn-outline'}`}
//           >
//             Costas
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col items-center">
//         {/* Visualização Anatômica */}
//         <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 mb-4">
//           <AnatomySVG view={view} activeMuscles={activeMuscles} />
//         </div>

//         {/* Legenda Interativa */}
//         <div className="mt-2 w-full">
//           <h4 className="font-medium text-gray-900 text-sm mb-3 text-center">
//             💪 Músculos Ativados:
//           </h4>
//           <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
//             {muscleDescriptions.map(({ name, description, color }) => (
//               <div 
//                 key={name}
//                 className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
//               >
//                 <div 
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: color }}
//                 ></div>
//                 <span className="text-sm text-blue-800 font-medium">
//                   {description}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Dica de Execução */}
//         <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 w-full">
//           <h5 className="font-medium text-amber-900 text-sm mb-1 flex items-center">
//             <span className="mr-1">💡</span>
//             Dica do Instrutor:
//           </h5>
//           <p className="text-xs text-amber-800 leading-relaxed">
//             {exerciseTip}
//           </p>
//         </div>

//         {/* Intensidade do Exercício */}
//         <div className="mt-3 w-full">
//           <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
//             <span>Intensidade:</span>
//             <span className="font-medium">
//               {exercise.type === 'cardio' ? 'Alta' : 'Média'}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className={`h-2 rounded-full ${
//                 exercise.type === 'cardio' ? 'bg-red-500' : 'bg-blue-500'
//               }`}
//               style={{
//                 width: exercise.type === 'cardio' ? '85%' : '60%'
//               }}
//             ></div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomMuscleView;