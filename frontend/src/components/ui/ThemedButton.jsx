// // src/components/ui/ThemedButton.jsx
// import React from 'react';
// import { useTheme } from '../../contexts/ThemeContext';

// const ThemedButton = ({ 
//   children, 
//   variant = 'primary', 
//   className = '', 
//   ...props 
// }) => {
//   const { theme } = useTheme();

//   const variants = {
//     primary: {
//       background: `linear-gradient(135deg, ${theme.button.primary}, ${theme.button.primaryHover})`,
//       color: 'white',
//       border: 'none'
//     },
//     secondary: {
//       background: theme.button.secondary,
//       color: theme.text.primary,
//       border: `1px solid ${theme.border.primary}`
//     },
//     outline: {
//       background: 'transparent',
//       color: theme.button.primary,
//       border: `2px solid ${theme.button.primary}`
//     }
//   };

//   return (
//     <button
//       className={`px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-105 ${className}`}
//       style={variants[variant]}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default ThemedButton;