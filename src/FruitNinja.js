import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Clock, Sparkles, Sword } from 'lucide-react';
import confetti from 'canvas-confetti';

const FruitNinja = ({ onClose, onScoreUpdate }) => {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState('ready');
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [lastSliceTime, setLastSliceTime] = useState(0);
  const gameAreaRef = useRef(null);
  const [slicePath, setSlicePath] = useState([]);

  const difficultySettings = {
    easy: { fruitSpeed: 1, spawnInterval: 1200, gameDuration: 90 },
    medium: { fruitSpeed: 1.5, spawnInterval: 1000, gameDuration: 60 },
    hard: { fruitSpeed: 2, spawnInterval: 800, gameDuration: 45 }
  };
  

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      const fruitSpawner = setInterval(() => {
        spawnFruit();
      }, difficultySettings[difficulty].spawnInterval);

      return () => {
        clearInterval(timer);
        clearInterval(fruitSpawner);
      };
    }
  }, [gameState, difficulty]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(difficultySettings[difficulty].gameDuration);
    setFruits([]);
    setCombo(0);
    setSlicePath([]);
  };

  const endGame = () => {
    setGameState('finished');
    onScoreUpdate(score);
    setHighScore((prevHighScore) => Math.max(prevHighScore, score));
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const spawnFruit = () => {
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      const newFruit = {
        id: Date.now(),
        x: Math.random() * (width - 50),
        y: height,
        type: ['🍎', '🍊', '🍋', '🍉', '🍇', '🍍', '🥝', '🍓', '🍌', '🍒', '🍑'][Math.floor(Math.random() * 11)],
        rotation: Math.random() * 360,
        speed: Math.random() * 2 + difficultySettings[difficulty].fruitSpeed,
      };
      setFruits((prevFruits) => [...prevFruits, newFruit]);
    }
  };

  const handleSlice = (id, clientX, clientY) => {
    const now = Date.now();
    if (now - lastSliceTime < 500) {
      setCombo((prevCombo) => prevCombo + 1);
    } else {
      setCombo(1);
    }
    setLastSliceTime(now);

    setScore((prevScore) => prevScore + 10 * combo);
    setFruits((prevFruits) => prevFruits.filter((fruit) => fruit.id !== id));

    // Add slice path for animation
    setSlicePath((prevPath) => [...prevPath, { x: clientX, y: clientY, time: now }]);
    setTimeout(() => setSlicePath((prevPath) => prevPath.filter(point => now - point.time < 200)), 200);

    // Add fruit splatter effect
    const splatter = document.createElement('div');
    splatter.className = 'fruit-splatter';
    splatter.style.left = `${clientX}px`;
    splatter.style.top = `${clientY}px`;
    gameAreaRef.current.appendChild(splatter);
    setTimeout(() => splatter.remove(), 1000);
  };

  const handleMouseMove = (e) => {
    if (gameAreaRef.current) {
      const { left, top } = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      gameAreaRef.current.style.setProperty('--cursor-x', `${x}px`);
      gameAreaRef.current.style.setProperty('--cursor-y', `${y}px`);
    }
  };

  const handleTouchMove = (e) => {
    if (gameAreaRef.current && e.touches[0]) {
      const { left, top } = gameAreaRef.current.getBoundingClientRect();
      const x = e.touches[0].clientX - left;
      const y = e.touches[0].clientY - top;
      gameAreaRef.current.style.setProperty('--cursor-x', `${x}px`);
      gameAreaRef.current.style.setProperty('--cursor-y', `${y}px`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 p-4 sm:p-6 rounded-xl w-full max-w-2xl relative overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-white">Fruit Ninja Extreme</h2>

        <div className="flex justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center bg-gray-700 p-2 rounded-lg">
            <Trophy className="mr-2 text-yellow-400" size={20} />
            <span className="font-bold text-white">Score: {score}</span>
          </div>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg">
            <Clock className="mr-2 text-blue-400" size={20} />
            <span className="font-bold text-white">Time: {timeLeft}s</span>
          </div>
          <div className="flex items-center bg-gray-700 p-2 rounded-lg">
            <Sparkles className="mr-2 text-pink-400" size={20} />
            <span className="font-bold text-white">Combo: x{combo}</span>
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative w-full h-64 sm:h-96 bg-gradient-to-b from-blue-900 to-purple-900 rounded-lg overflow-hidden mb-4 cursor-none touch-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {gameState === 'playing' && (
            <AnimatePresence>
              {fruits.map((fruit) => (
                <motion.div
                  key={fruit.id}
                  initial={{ y: fruit.y, x: fruit.x, rotate: fruit.rotation, scale: 0 }}
                  animate={{ y: -50, rotate: fruit.rotation + 360, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 3 / fruit.speed, ease: 'easeOut' }}
                  className="absolute text-4xl sm:text-5xl cursor-none"
                  onClick={(e) => handleSlice(fruit.id, e.clientX, e.clientY)}
                  onTouchStart={(e) => handleSlice(fruit.id, e.touches[0].clientX, e.touches[0].clientY)}
                >
                  {fruit.type}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <svg className="absolute inset-0 pointer-events-none" style={{ filter: 'drop-shadow(0 0 10px white)' }}>
            <path
              d={`M ${slicePath.map(point => `${point.x},${point.y}`).join(' L ')}`}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="d"
                dur="0.2s"
                repeatCount="1"
                fill="freeze"
              />
            </path>
          </svg>
          <div className="custom-cursor"></div>
        </div>

        {gameState === 'ready' && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white">Select Difficulty</h3>
            <div className="flex justify-center space-x-4 mb-6">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    difficulty === level
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
            >
              Start Slicing!
            </motion.button>
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gray-700 p-6 rounded-lg"
          >
            <p className="text-3xl font-bold mb-4 text-white">Game Over!</p>
            <p className="text-xl mb-2 text-gray-300">Your score: {score}</p>
            <p className="text-xl mb-6 text-gray-300">High score: {highScore}</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
              >
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
              >
                Exit
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
      <style jsx>{`
        .custom-cursor {
          width: 40px;
          height: 40px;
          position: absolute;
          pointer-events: none;
          transform: translate(-50%, -50%);
          left: var(--cursor-x);
          top: var(--cursor-y);
        }
        .custom-cursor::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z'%3E%3C/path%3E%3C/svg%3E");
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.7));
        }
        .fruit-splatter {
          position: absolute;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: splatter 1s ease-out;
        }
        @keyframes splatter {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        @media (max-width: 640px) {
          .custom-cursor {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default FruitNinja;