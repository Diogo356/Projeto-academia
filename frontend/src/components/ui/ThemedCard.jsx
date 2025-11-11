// // src/components/ui/ThemedCard.jsx
// import React from 'react';
// import { useTheme } from '../../contexts/ThemeContext';

// const ThemedCard = ({ children, className = '', variant = 'default', ...props }) => {
//   const { theme, getGradient } = useTheme();

//   const variants = {
//     default: {
//       background: theme.background.primary,
//       border: `1px solid ${theme.border.primary}`,
//       color: theme.text.primary
//     },
//     elevated: {
//       background: theme.background.primary,
//       border: `1px solid ${theme.border.primary}`,
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//       color: theme.text.primary
//     },
//     gradient: {
//       background: getGradient(),
//       border: `1px solid ${theme.border.primary}`,
//       color: theme.text.primary
//     }
//   };

//   return (
//     <div
//       className={`rounded-3xl p-6 ${className}`}
//       style={variants[variant]}
//       {...props}
//     >
//       {children}
//     </div>
//   );
// };

// export default ThemedCard;