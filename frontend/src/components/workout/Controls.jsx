
const Controls = ({ 
  isRunning, 
  isPaused, 
  onStart, 
  onPause, 
  onResume, 
  onStop, 
  onComplete 
}) => {
  return (
    <div className="flex justify-center space-x-4">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="btn btn-lg btn-primary px-8"
        >
          ▶️ Iniciar
        </button>
      ) : (
        <>
          {isPaused ? (
            <button
              onClick={onResume}
              className="btn btn-lg btn-success px-8"
            >
              🔄 Continuar
            </button>
          ) : (
            <button
              onClick={onPause}
              className="btn btn-lg btn-warning px-8"
            >
              ⏸️ Pausar
            </button>
          )}
          <button
            onClick={onStop}
            className="btn btn-lg btn-error px-8"
          >
            ⏹️ Parar
          </button>
          <button
            onClick={onComplete}
            className="btn btn-lg btn-success px-8"
          >
            ✅ Concluir
          </button>
        </>
      )}
    </div>
  );
};

export default Controls;