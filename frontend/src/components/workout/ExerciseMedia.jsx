import React from 'react';
import { MdOndemandVideo } from 'react-icons/md';

const ExerciseMedia = ({ videoUrl, exerciseName }) => {
  // Detecta a extensão do arquivo
  const isVideo = videoUrl && videoUrl.match(/\.(mp4|webm|ogg|mov)$/i);
  const isGif = videoUrl && videoUrl.match(/\.(gif)$/i);
  const isImage = videoUrl && videoUrl.match(/\.(jpg|jpeg|png|webp)$/i);

  if (isVideo) {
    return (
      <video
        key={videoUrl}
        src={videoUrl}
        className="w-full h-full object-cover absolute top-0 left-0"
        autoPlay
        loop
        muted
        playsInline
        title={`Demonstração de ${exerciseName}`}
      />
    );
  }

  // Trata GIF e imagens normais (como object-contain)
  if (isGif || isImage) {
    return (
      <img
        key={videoUrl}
        src={videoUrl}
        alt={`Demonstração de ${exerciseName}`}
        className="w-full h-full object-contain absolute top-0 left-0"
      />
    );
  }
  
  // Fallback se não for nenhum dos tipos esperados ou se a URL estiver ausente
  return (
    <div className="text-center text-white p-4 flex flex-col items-center justify-center h-full">
      <MdOndemandVideo className="text-4xl lg:text-6xl mb-4 mx-auto text-blue-400" />
      <p className="text-lg xl:text-xl font-semibold mb-2">Demonstração Indisponível</p>
      <p className="text-gray-300 text-sm xl:text-base">
        Nenhuma mídia encontrada para este exercício.
      </p>
    </div>
  );
};

export default ExerciseMedia;