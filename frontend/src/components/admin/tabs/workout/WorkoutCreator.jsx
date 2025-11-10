// src/components/admin/WorkoutCreator.jsx
import React, { useState } from 'react';
import ExerciseForm from './ExerciseForm';
import ExerciseList from './ExerciseList';
import WorkoutSummary from './WorkoutSummary';

const WorkoutCreator = () => {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    description: '',
    totalDuration: 0,
    difficulty: 'intermediate',
    category: 'cardio',
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    duration: 0,
    type: 'cardio',
    targetMuscles: [],
    mediaFile: null,
    instructions: '',
    restTime: 30,
    sets: 3,
    reps: 12,
    weight: 0
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('exercises'); // PRIMEIRA ABA

  const validateWorkout = () => {
    const newErrors = {};
    if (!workoutData.name.trim()) newErrors.name = 'Nome do treino é obrigatório';
    if (workoutData.exercises.length === 0) newErrors.exercises = 'Adicione pelo menos um exercício';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOrUpdateExercise = (exerciseData) => {
    setWorkoutData(prev => {
      let updatedExercises = [...prev.exercises];
      let durationDelta = exerciseData.duration;

      if (editingIndex !== null) {
        durationDelta -= prev.exercises[editingIndex].duration;
        updatedExercises[editingIndex] = { ...exerciseData, id: prev.exercises[editingIndex].id };
      } else {
        updatedExercises.push({ ...exerciseData, id: Date.now() });
      }

      return {
        ...prev,
        exercises: updatedExercises,
        totalDuration: prev.totalDuration + durationDelta
      };
    });

    setEditingIndex(null);
    setCurrentExercise({
      name: '',
      duration: 0,
      type: 'cardio',
      targetMuscles: [],
      mediaFile: null,
      instructions: '',
      restTime: 30,
      sets: 3,
      reps: 12,
      weight: 0
    });
  };

  const removeExercise = (index) => {
    const updatedExercises = [...workoutData.exercises];
    const removedExercise = updatedExercises.splice(index, 1)[0];

    setWorkoutData(prev => ({
      ...prev,
      exercises: updatedExercises,
      totalDuration: prev.totalDuration - removedExercise.duration
    }));

    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentExercise({
        name: '',
        duration: 0,
        type: 'cardio',
        targetMuscles: [],
        mediaFile: null,
        instructions: '',
        restTime: 30,
        sets: 3,
        reps: 12,
        weight: 0
      });
    }
  };

  const startEditing = (index) => {
    setCurrentExercise({ ...workoutData.exercises[index] });
    setEditingIndex(index);
    setActiveTab('exercises');
  };

  const saveWorkout = () => {
    if (!validateWorkout()) return;
    
    const workoutToSave = {
      ...workoutData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Treino salvo:', workoutToSave);
    alert('Treino salvo com sucesso!');

    setWorkoutData({
      name: '',
      description: '',
      totalDuration: 0,
      difficulty: 'intermediate',
      category: 'cardio',
      exercises: []
    });
    setActiveTab('exercises');
  };

  // ABAS: Exercícios primeiro, Revisar depois
  const tabs = [
    { id: 'exercises', label: 'Exercícios', icon: '💪' },
    { id: 'review', label: 'Revisar', icon: '👁️' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Criar Novo Treino
              </h1>
              <p className="text-gray-600 mt-2">
                Adicione exercícios e monte seu treino
              </p>
            </div>
            
            <WorkoutSummary workoutData={workoutData} />
          </div>

          {/* Navegação por Abas */}
          <div className="mt-6">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Conteúdo Principal */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Gerenciar Exercícios */}
            {activeTab === 'exercises' && (
              <div className="space-y-6">
                <ExerciseForm
                  exercise={currentExercise}
                  onChange={setCurrentExercise}
                  onSubmit={addOrUpdateExercise}
                  onCancel={() => setEditingIndex(null)}
                  editingIndex={editingIndex}
                  errors={errors}
                />

                {workoutData.exercises.length > 0 && (
                  <ExerciseList
                    exercises={workoutData.exercises}
                    onEdit={startEditing}
                    onRemove={removeExercise}
                    errors={errors}
                  />
                )}
              </div>
            )}

            {/* Revisão */}
            {activeTab === 'review' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  Revisão Final do Treino
                </h3>
                
                {errors.exercises && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-700">{errors.exercises}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{workoutData.exercises.length}</div>
                    <div className="text-sm text-blue-700 font-medium">Exercícios</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor(workoutData.totalDuration / 60)}:{String(workoutData.totalDuration % 60).padStart(2, '0')}
                    </div>
                    <div className="text-sm text-green-700 font-medium">Duração Total</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 capitalize">
                      {workoutData.difficulty}
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Dificuldade</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg">Sequência do Treino</h4>
                  {workoutData.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{exercise.name}</div>
                        <div className="text-sm text-gray-600">
                          {Math.floor(exercise.duration / 60)}min • {exercise.type} • {exercise.targetMuscles.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar de Ações */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button
                  onClick={saveWorkout}
                  disabled={!workoutData.name || workoutData.exercises.length === 0}
                  className="btn btn-primary w-full"
                >
                  Salvar Treino
                </button>
                
                <button className="btn btn-outline w-full">
                  Salvar como Rascunho
                </button>
                
                <button 
                  onClick={() => {
                    setWorkoutData({
                      name: '',
                      description: '',
                      totalDuration: 0,
                      difficulty: 'intermediate',
                      category: 'cardio',
                      exercises: []
                    });
                    setActiveTab('exercises');
                  }}
                  className="btn btn-ghost w-full text-red-600 hover:bg-red-50"
                >
                  Limpar Tudo
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${
                      workoutData.exercises.length > 0 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {workoutData.exercises.length > 0 ? 'Pronto' : 'Incompleto'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Progresso:</span>
                    <span className="font-medium">
                      {workoutData.exercises.length} ex.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="text-lg mr-2">Tip</span>
                Dicas Profissionais
              </h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use nomes claros e objetivos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Adicione mídia demonstrativa</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Especifique músculos corretamente</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Inclua instruções detalhadas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCreator;