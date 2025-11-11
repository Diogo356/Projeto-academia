// src/components/ui/ColorPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaCheck } from 'react-icons/fa';

const ColorPicker = ({ 
  label, 
  value, 
  onChange, 
  presetColors = [],
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const pickerRef = useRef(null);

  // Cores padrão se não forem fornecidas
  const defaultColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
    '#6366F1', '#06B6D4', '#84CC16', '#F97316', '#DC2626', '#7C3AED'
  ];

  const colors = presetColors.length > 0 ? presetColors : defaultColors;

  // Fecha o picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sincroniza o input quando o value muda
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    // Só atualiza se for uma cor válida
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Se não for uma cor válida, volta para o valor anterior
    if (!/^#[0-9A-F]{6}$/i.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className={`space-y-3 ${className}`} ref={pickerRef}>
      <label className="block text-sm font-medium text-gray-700 capitalize">
        {label}
      </label>
      
      <div className="flex items-center space-x-3">
        {/* Preview da Cor */}
        <div
          className="w-16 h-16 rounded-2xl border-4 border-white cursor-pointer shadow-lg hover:scale-105 transition-transform relative"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <FaPalette className="text-white text-opacity-70 text-lg" />
          </div>
        </div>

        {/* Input HEX - AGORA FUNCIONAL */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onBlur={handleInputBlur}
              placeholder="#3B82F6"
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Digite o código HEX</p>
        </div>
      </div>

      {/* Picker de Cores */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-4">
              {/* Cores Pré-definidas */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaPalette className="text-gray-400" />
                  Cores Sugeridas
                </h4>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-lg cursor-pointer border-2 border-white shadow hover:scale-110 transition-transform relative"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        onChange(color);
                        setIsOpen(false);
                      }}
                    >
                      {value === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Seletor de Cores Profissional */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Seletor de Cores
                </h4>
                <div className="flex flex-col space-y-4">
                  <HexColorPicker 
                    color={value} 
                    onChange={onChange}
                    className="!w-full !h-32 rounded-lg"
                  />
                  
                  {/* Input HEX dentro do picker também */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-medium">HEX:</span>
                    <HexColorInput
                      color={value}
                      onChange={onChange}
                      prefixed
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-100 font-mono"
                    />
                  </div>
                  
                  {/* Preview */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Cor selecionada:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-sm text-gray-600 font-mono">{value}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;