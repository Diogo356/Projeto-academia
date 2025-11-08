const ExerciseInfo = ({ exercise, time }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        🏃‍♂️ {exercise.name}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">
            {exercise.speed} km/h
          </div>
          <div className="text-sm text-blue-500">Velocidade</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">
            {exercise.incline}%
          </div>
          <div className="text-sm text-green-500">Inclinação</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600">
            {exercise.distance.toFixed(1)} km
          </div>
          <div className="text-sm text-purple-500">Distância</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="text-2xl font-bold text-red-600">
            {exercise.calories}
          </div>
          <div className="text-sm text-red-500">Calorias</div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInfo;