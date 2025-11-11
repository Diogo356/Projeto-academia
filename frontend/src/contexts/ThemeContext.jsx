// // src/contexts/ThemeContext.jsx
// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// const defaultTheme = {
//   primary: '#3B82F6',
//   secondary: '#1E40AF',
//   background: {
//     primary: '#FFFFFF',
//     secondary: '#F8FAFC',
//     tertiary: '#F1F5F9',
//     app: 'linear-gradient(135deg, #3B82F615, #1E40AF15)',
//   },
//   text: { primary: '#1E293B', secondary: '#64748B', accent: '#3B82F6' },
//   border: { primary: '#E2E8F0', secondary: '#CBD5E1' },
//   button: {
//     primary: '#3B82F6',
//     primaryHover: '#2563EB',
//     secondary: '#F1F5F9',
//     secondaryHover: '#E2E8F0',
//   },
// };

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children, companyTheme }) => {
//   const [theme, setTheme] = useState(defaultTheme);
//   const prevColorsRef = useRef({ primary: null, secondary: null });

//   // Funções auxiliares
//   const adjust = (hex, amount) => {
//     if (!hex) return hex;
//     return '#' + hex.replace(/^#/, '').replace(/../g, c =>
//       ('0' + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2)
//     );
//   };

//   const makeAppGradient = (p, s) => `linear-gradient(135deg, ${p}15, ${s}15)`;

//   // updateTheme ESTÁVEL com useCallback
//   const updateTheme = useCallback((newPrimary, newSecondary) => {
//     const p = newPrimary || theme.primary;
//     const s = newSecondary || theme.secondary;

//     // Evita atualização desnecessária
//     if (prevColorsRef.current.primary === p && prevColorsRef.current.secondary === s) {
//       return;
//     }

//     prevColorsRef.current = { primary: p, secondary: s };

//     setTheme(prev => ({
//       ...prev,
//       primary: p,
//       secondary: s,
//       text: { ...prev.text, accent: p },
//       button: {
//         primary: p,
//         primaryHover: adjust(p, -20),
//         secondary: s,
//         secondaryHover: adjust(s, -20),
//       },
//       background: {
//         ...prev.background,
//         app: makeAppGradient(p, s),
//       },
//     }));
//   }, [theme.primary, theme.secondary]); // dependências estáveis

//   // Atualiza com companyTheme (apenas na primeira carga)
//   useEffect(() => {
//     if (companyTheme?.primaryColor || companyTheme?.secondaryColor) {
//       updateTheme(companyTheme.primaryColor, companyTheme.secondaryColor);
//     }
//   }, [companyTheme, updateTheme]);

//   // Aplica no <body> – só quando o gradiente mudar
//   useEffect(() => {
//     document.body.style.background = theme.background.app;
//     document.body.style.minHeight = '100vh';
//     document.body.style.transition = 'background 0.4s ease';
//   }, [theme.background.app]);

//   const getGradient = (angle = '135deg') => {
//     return theme.background.app.replace('135deg', angle);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, updateTheme, getGradient, adjust }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error('useTheme must be used within ThemeProvider');
//   return context;
// };