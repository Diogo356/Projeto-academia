/**
 * Retorna uma URL de mídia fallback baseada no tipo.
 */
export const getFallbackMedia = (type) => {
      const media = {
        cardio: '/videos/cardio-demo.mp4',
        strength: '/videos/strength-demo.mp4',
        hiit: '/videos/hiit-demo.mp4',
        yoga: '/videos/yoga-demo.mp4',
        pilates: '/videos/pilates-demo.mp4',
        mobility: '/videos/mobility-demo.mp4',
        warmup: '/gifs/warmup-demo.gif',
      };
      return media[type] || '/videos/default-demo.mp4';
    };
    
    /**
     * Retorna dicas genéricas baseadas no tipo de exercício.
     */
    export const getFallbackTips = (type) => {
      const tipsByType = {
        cardio: [
          'Mantenha uma postura ereta',
          'Controle sua respiração',
          'Ajuste a intensidade conforme seu condicionamento',
        ],
        strength: [
          'Mantenha o core contraído',
          'Execute o movimento de forma controlada',
          'Não trave as articulações no final do movimento',
        ],
        warmup: [
          'Comece com movimentos leves e controlados.',
          'Aumente a amplitude gradualmente.',
          'Siga o ritmo do seu corpo, sem forçar.',
        ],
      };
    
      const defaultTips = [
        'Mantenha a postura correta',
        'Respire de forma constante',
        'Mantenha-se hidratado',
      ];
    
      return tipsByType[type] || defaultTips;
    };
    
    /**
     * Formata segundos para o formato MM:SS
     */
    export const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };