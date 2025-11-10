// src/components/admin/MuscleSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import BodyHighlighter from '@mjcdev/react-body-highlighter';

const MuscleSelector = ({ selectedMuscles, onMuscleSelect }) => {
    const muscleSlugs = {
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
    };

    const slugToMuscle = Object.fromEntries(
        Object.entries(muscleSlugs).map(([pt, slug]) => [slug, pt])
    );

    const muscleDescriptions = {
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
    };

    const nonBodyMuscles = ['Cardio', 'Full Body'];
    const [tooltip, setTooltip] = useState(null);
    const frontRef = useRef(null);
    const backRef = useRef(null);

    const highlightedData = selectedMuscles
        .filter(m => muscleSlugs[m])
        .map(m => ({ slug: muscleSlugs[m], intensity: 1 }));

    const handleBodyPartClick = (bodyPart) => {
        const muscle = slugToMuscle[bodyPart.slug];
        if (muscle) onMuscleSelect(muscle);
    };

    const attachTooltips = () => {
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
                const isBack = container === backRef.current; // Determina se é costas

                path.style.cursor = 'pointer';
                path.dataset.tooltipAttached = 'true';

                path.addEventListener('mouseenter', (e) => {
                    setTooltip({
                        name: muscle,
                        desc,
                        x: e.clientX,
                        y: e.clientY,
                        side: isBack ? 'left' : 'right', // FIXO POR MÚSCULO
                    });
                });

                path.addEventListener('mousemove', (e) => {
                    setTooltip(prev => prev ? {
                        ...prev,
                        x: e.clientX,
                        y: e.clientY,
                        // side NÃO muda aqui
                    } : null);
                });

                path.addEventListener('mouseleave', () => {
                    setTooltip(null);
                });
            });
        });
    };

    useEffect(() => {
        const tryAttach = () => attachTooltips();
        const interval = setInterval(tryAttach, 300);
        const timeout = setTimeout(() => clearInterval(interval), 5000);

        const observer = new MutationObserver(tryAttach);
        [frontRef.current, backRef.current].forEach(ref => {
            if (ref) observer.observe(ref, { childList: true, subtree: true });
        });

        tryAttach();

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, [highlightedData]);

    return (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative">
            <label className="block text-sm font-medium text-gray-700 mb-4">
                Músculos Alvo
            </label>

            <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-8">
                {['front', 'back'].map(side => (
                    <div key={side} className="text-center" ref={side === 'front' ? frontRef : backRef}>
                        <div className="inline-block p-2 bg-white rounded-lg shadow-sm">
                            <BodyHighlighter
                                data={highlightedData}
                                side={side}
                                onBodyPartClick={handleBodyPartClick}
                                style={{
                                    width: '180px',
                                    height: '320px',
                                    borderRadius: '12px',
                                }}
                            />
                        </div>
                        <span className="text-sm text-gray-600 mt-2 font-medium">
                            {side === 'front' ? 'Frente' : 'Costas'}
                        </span>
                    </div>
                ))}
            </div>

            {/* TOOLTIP LATERAL FIXO POR MÚSCULO */}
            {tooltip && (
                <div
                    className="fixed z-[9999] bg-gradient-to-br from-gray-900 to-black text-white text-xs font-medium rounded-lg shadow-2xl p-3 max-w-xs pointer-events-none border border-gray-700"
                    style={{
                        left: tooltip.side === 'left' 
                            ? `${tooltip.x - 16}px` 
                            : `${tooltip.x + 16}px`,
                        top: `${tooltip.y}px`,
                        transform: tooltip.side === 'left'
                            ? 'translateX(-100%) translateY(-50%)'
                            : 'translateY(-50%)',
                        animation: 'slideIn 0.15s ease-out',
                    }}
                >
                    <div className="text-blue-400 font-bold">{tooltip.name}</div>
                    <div className="mt-1 opacity-90 leading-tight">{tooltip.desc}</div>

                    {/* Seta */}
                    <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-gray-900 to-black rotate-45"
                        style={{
                            [tooltip.side === 'left' ? 'right' : 'left']: '-6px',
                            boxShadow: '0 0 3px rgba(0,0,0,0.4)',
                        }}
                    />
                </div>
            )}

            {/* Músculos Não Corporais */}
            <div className="flex justify-center gap-3 mb-6">
                {nonBodyMuscles.map(muscle => (
                    <button
                        key={muscle}
                        type="button"
                        onClick={() => onMuscleSelect(muscle)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedMuscles.includes(muscle)
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        {muscle}
                    </button>
                ))}
            </div>

            {/* Músculos Selecionados */}
            {selectedMuscles.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Músculos Selecionados ({selectedMuscles.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {selectedMuscles.map((muscle, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                            >
                                <span className="text-sm font-medium">{muscle}</span>
                                <button
                                    type="button"
                                    onClick={() => onMuscleSelect(muscle)}
                                    className="text-blue-600 hover:text-blue-800 text-lg font-bold"
                                >
                                    times
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from { 
                        opacity: 0; 
                        transform: ${
                          tooltip?.side === 'left'
                            ? 'translateX(-100%) translateY(-50%) translateX(-10px)'
                            : 'translateY(-50%) translateX(10px)'
                        }; 
                    }
                    to { 
                        opacity: 1; 
                        transform: ${
                          tooltip?.side === 'left'
                            ? 'translateX(-100%) translateY(-50%)'
                            : 'translateY(-50%)'
                        }; 
                    }
                }
            `}</style>
        </div>
    );
};

export default MuscleSelector;