import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StyledButton = ({ text, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotateY: isHovered ? [0, 5, -5, 0] : 0,
        transition: {
          duration: 0.5,
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
      className="relative bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 overflow-hidden group"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          y: isHovered ? [0, -2, 2, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <span className="mr-2">{text}</span>
        <motion.svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            x: isHovered ? [0, 5, 0] : 0,
            rotateZ: isHovered ? [0, 15, -15, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </motion.svg>
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-white opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          transformOrigin: 'center',
          transform: 'translateZ(-10px)',
        }}
        animate={{
          rotateX: isHovered ? 15 : 0,
          rotateY: isHovered ? 15 : 0,
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          mixBlendMode: 'overlay',
        }}
        animate={{
          scale: isHovered ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.button>
  );
};

export default StyledButton;