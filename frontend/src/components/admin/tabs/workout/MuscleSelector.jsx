// src/components/admin/MuscleSelector.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BodyHighlighter from '@mjcdev/react-body-highlighter';
import { FaTimes, FaInfoCircle, FaRunning, FaFire, FaLock, FaHeartbeat } from 'react-icons/fa';

const MuscleSelector = ({ selectedMuscles = [], onMuscleSelect, disabled = false }) => {
  const muscleSlugs = useMemo(() => ({
    'Peito': 'chest',
    'Costas Superiores': 'upper-back',
    'Costas Inferiores': 'lower-back',
    'Ombros': 'deltoids',
    'Trapézio': 'trapezius',
    'Bíceps': 'biceps',
    'Tríceps': 'triceps',
    'Antebraços': 'forearm',
    'Adutores': 'adductors',
    'Quadríceps': 'quadriceps',
    'Posteriores': 'hamstring',
    'Glúteos': 'gluteal',
    'Panturrilhas': 'calves',
    'Tibial Anterior': 'tibialis',
    'Oblíquos': 'obliques',
    'Abdômen': 'abs',
    'Pescoço': 'neck',
    'Joelhos': 'knees',
    'Tornozelos': 'ankles',
    'Mãos': 'hands',
    'Pés': 'feet',
    'Cabeça': 'head',
  }), []);

  const slugToMuscle = useMemo(() => 
    Object.fromEntries(Object.entries(muscleSlugs).map(([pt, slug]) => [slug, pt]))
  , [muscleSlugs]);

  const muscleDescriptions = useMemo(() => ({
    'Peito': 'Músculo peitoral maior. Empurra e aproxima os braços.',
    'Costas Superiores': 'Músculos superiores das costas. Puxar e estabilizar.',
    'Costas Inferiores': 'Lombar. Estabiliza coluna e postura.',
    'Ombros': 'Deltoides. Elevação e rotação do braço.',
    'Trapézio': 'Trapézio. Eleva e retrai os ombros.',
    'Bíceps': 'Flexiona o cotovelo e supina o antebraço.',
    'Tríceps': 'Extensão do cotovelo. Empurra.',
    'Antebraços': 'Flexores e extensores do punho e dedos.',
    'Adutores': 'Aproxima as pernas. Estabiliza quadril.',
    'Quadríceps': 'Extensão do joelho. Andar, correr, agachar.',
    'Posteriores': 'Flexão do joelho e extensão do quadril.',
    'Glúteos': 'Extensão e rotação do quadril. Potência.',
    'Panturrilhas': 'Flexão plantar. Impulsão e equilíbrio.',
    'Tibial Anterior': 'Dorsiflexão do pé. Evita tropeçar.',
    'Oblíquos': 'Rotação e flexão lateral do tronco.',
    'Abdômen': 'Reto abdominal. Flexão do tronco e estabilidade.',
    'Pescoço': 'Flexão, extensão e rotação da cabeça.',
    'Joelhos': 'Articulação. Não é músculo, mas região alvo.',
    'Tornozelos': 'Mobilidade e estabilidade do pé.',
    'Mãos': 'Músculos intrínsecos. Precisão e força.',
    'Pés': 'Arcos do pé. Suporte e impulsão.',
    'Cabeça': 'Região estética. Sem treino direto.',
  }), []);

  const nonBodyMuscles = ['Cardio', 'Full Body'];
  const [tooltip, setTooltip] = useState(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const containerRef = useRef(null);

  // === REGRAS DE BLOQUEIO ===
  const hasSpecial = selectedMuscles.some(m => nonBodyMuscles.includes(m));
  const hasIndividual = selectedMuscles.some(m => muscleSlugs[m]);
  const bodyLocked = disabled || hasSpecial;
  const specialLocked = disabled || hasIndividual;

  // === DADOS PARA HIGHLIGHT ===
  const highlightedData = useMemo(() => {
    let data = [];

    if (selectedMuscles.includes('Full Body')) {
      // Destaca TODO o corpo
      data = Object.values(muscleSlugs).map(slug => ({ slug, intensity: 0.7 }));
    } else if (selectedMuscles.includes('Cardio')) {
      // Destaca pernas + coração (simbólico)
      data = [
        { slug: 'quadriceps', intensity: 0.9 },
        { slug: 'hamstring', intensity: 0.9 },
        { slug: 'calves', intensity: 0.8 },
        { slug: 'gluteal', intensity: 0.7 },
      ];
    } else {
      // Músculos norm totais
      data = selectedMuscles
        .filter(m => muscleSlugs[m])
        .map(m => ({ slug: muscleSlugs[m], intensity: 1 }));
    }

    return data;
  }, [selectedMuscles, muscleSlugs]);

  const handleBodyPartClick = useCallback((bodyPart) => {
    if (bodyLocked) return;
    const muscle = slugToMuscle[bodyPart.slug];
    if (muscle) onMuscleSelect(muscle);
  }, [slugToMuscle, onMuscleSelect, bodyLocked]);

  const handleSpecialClick = useCallback((muscle) => {
    if (specialLocked) return;
    onMuscleSelect(muscle);
  }, [onMuscleSelect, specialLocked]);

  const getTooltipPosition = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0, side: 'right' };

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const spaceRight = window.innerWidth - mouseX;
    const spaceLeft = mouseX;

    const side = spaceRight > 300 ? 'right' : spaceLeft > 300 ? 'left' : 'top';
    const x = side === 'right' ? mouseX + 16 : mouseX - 16;
    const y = side === 'top' ? mouseY - 16 : mouseY;

    return { x, y, side };
  }, []);

  const attachTooltips = useCallback(() => {
    [frontRef.current, backRef.current].forEach(container => {
      if (!container) return;
      const svg = container.querySelector('svg');
      if (!svg) return;

      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        const slug = path.getAttribute('data-slug') || path.getAttribute('id');
        if (!slug || !slugToMuscle[slug]) return;
        if (path.dataset.tooltipAttached) return;

        const muscle = slugToMuscle[slug];
        const desc = muscleDescriptions[muscle] || 'Músculo envolvido.';

        path.style.cursor = bodyLocked ? 'not-allowed' : 'pointer';
        path.style.transition = 'all 0.2s ease';
        path.dataset.tooltipAttached = 'true';

        const handleMouseEnter = (e) => {
          if (bodyLocked) return;
          const pos = getTooltipPosition(e);
          setTooltip({ name: muscle, desc, ...pos });
        };

        const handleMouseMove = (e) => {
          if (!tooltip || bodyLocked) return;
          const pos = getTooltipPosition(e);
          setTooltip(prev => prev ? { ...prev, ...pos } : null);
        };

        const handleMouseLeave = () => setTooltip(null);

        path.addEventListener('mouseenter', handleMouseEnter);
        path.addEventListener('mousemove', handleMouseMove);
        path.addEventListener('mouseleave', handleMouseLeave);

        // Hover visual
        path.addEventListener('mouseenter', () => {
          if (!bodyLocked && !selectedMuscles.includes(muscle)) {
            path.style.opacity = '0.7';
            path.style.filter = 'brightness(1.2)';
          }
        });
        path.addEventListener('mouseleave', () => {
          path.style.opacity = '';
          path.style.filter = '';
        });
      });
    });
  }, [slugToMuscle, muscleDescriptions, getTooltipPosition, bodyLocked, selectedMuscles]);

  useEffect(() => {
    const timer = setTimeout(attachTooltips, 100);
    return () => clearTimeout(timer);
  }, [attachTooltips]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8 border border-gray-200 shadow-inner"
    >
      <div className="flex items-center justify-between mb-6">
        <label className="text-lg font-bold text-gray-800 flex items-center">
          Músculos Alvo
        </label>
        <span className="text-sm text-gray-600 font-medium">
          {selectedMuscles.length} selecionado{selectedMuscles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Corpo Humano */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {['front', 'back'].map(side => (
          <motion.div
            key={side}
            whileHover={bodyLocked ? {} : { scale: 1.02 }}
            className={`flex flex-col items-center ${bodyLocked ? 'opacity-60' : ''}`}
            ref={side === 'front' ? frontRef : backRef}
          >
            <div className={`inline-block p-4 bg-white rounded-2xl shadow-lg border ${bodyLocked ? 'border-gray-300' : 'border-gray-100'}`}>
              <BodyHighlighter
                data={highlightedData}
                side={side}
                onBodyPartClick={handleBodyPartClick}
                style={{
                  width: '200px',
                  height: '360px',
                  borderRadius: '16px',
                  filter: bodyLocked ? 'grayscale(0.5) opacity(0.7)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
            <motion.span
              className={`block mt-3 text-sm font-semibold px-4 py-1 rounded-full shadow-sm inline-block ${
                bodyLocked ? 'bg-gray-200 text-gray-500' : 'bg-white text-gray-700'
              }`}
            >
              {side === 'front' ? 'Frente' : 'Costas'}
            </motion.span>
            {bodyLocked && (
              <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                <FaLock className="mr-1" /> Bloqueado
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[9999] bg-gradient-to-br from-gray-900 to-black text-white text-xs font-medium rounded-xl shadow-2xl p-4 max-w-xs pointer-events-none border border-gray-700"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: tooltip.side === 'left' ? 'translateX(-100%) translateY(-50%)' : 
                        tooltip.side === 'top' ? 'translateX(-50%) translateY(-100%)' : 'translateY(-50%)',
            }}
          >
            <div className="flex items-start space-x-2">
              <FaInfoCircle className="text-blue-400 mt-0.5" />
              <div>
                <div className="text-blue-300 font-bold text-sm">{tooltip.name}</div>
                <div className="mt-1 opacity-90 leading-tight text-xs">{tooltip.desc}</div>
              </div>
            </div>
            <div
              className="absolute w-3 h-3 bg-gradient-to-br from-gray-900 to-black rotate-45"
              style={{
                ...(tooltip.side === 'left' ? { right: '-6px' } : 
                   tooltip.side === 'top' ? { bottom: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' } : 
                   { left: '-6px' }),
                boxShadow: '0 0 6px rgba(0,0,0,0.3)'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botões Especiais */}
      <div className="flex justify-center gap-3 mb-6 flex-wrap">
        {nonBodyMuscles.map(muscle => {
          const isSelected = selectedMuscles.includes(muscle);
          const Icon = muscle === 'Cardio' ? FaHeartbeat : FaFire;
          const locked = specialLocked;

          return (
            <motion.button
              key={muscle}
              whileHover={locked ? {} : { scale: 1.05 }}
              whileTap={locked ? {} : { scale: 0.95 }}
              type="button"
              onClick={() => handleSpecialClick(muscle)}
              disabled={locked}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md'
              } ${locked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSelected && muscle === 'Cardio' && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 bg-white opacity-20 rounded-full"
                />
              )}
              <Icon className={`text-lg ${isSelected && muscle === 'Cardio' ? 'animate-pulse' : ''}`} />
              <span>{muscle}</span>
              {locked && <FaLock className="ml-1 text-xs" />}
            </motion.button>
          );
        })}
      </div>

      {/* Músculos Selecionados */}
      <AnimatePresence>
        {selectedMuscles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedMuscles.map((muscle, index) => (
                <motion.div
                  key={muscle}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-4 py-2 rounded-full shadow-sm border border-blue-200"
                >
                  <span className="text-sm font-semibold">{muscle}</span>
                  <button
                    type="button"
                    onClick={() => !disabled && onMuscleSelect(muscle)}
                    disabled={disabled}
                    className="text-blue-600 hover:text-blue-800 transition-all hover:scale-110"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MuscleSelector;