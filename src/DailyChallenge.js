import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, X, Gift, Clock, Zap, Award, TrendingUp, Shield, Sword, Bell, CreditCard ,DollarSign, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';

const ParticleAnimation = ({ isVisible }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    const updatePixelRatio = () => {
      setDevicePixelRatio(window.devicePixelRatio || 1);
    };
    updatePixelRatio();
    window.addEventListener('resize', updatePixelRatio);
    return () => window.removeEventListener('resize', updatePixelRatio);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    updateCanvasSize();

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 50;
    
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 2, // Increased particle size
      color: `hsl(${Math.random() * 60 + 30}, 100%, 75%)`, // Yellow-gold hue
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      },
      alpha: 0
    }));

    const animate = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.alpha})`);
        ctx.fill();

        // Gradually increase alpha for fade-in effect
        if (particle.alpha < 1) {
          particle.alpha += 0.02;
        }

        // Move away from mouse
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
          particle.x += dx / distance * 2;
          particle.y += dy / distance * 2;
        }

        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.velocity.x *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.velocity.y *= -1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, devicePixelRatio]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'lighten' }}
    />
  );
};

const PulsingButton = ({ children, onClick, className }) => {
  return (
    <motion.button
      className={`relative ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-yellow-300 opacity-75"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};


const DailyChallenge = ({ onComplete }) => {
  const [challenge, setChallenge] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [difficultyLevel, setDifficultyLevel] = useState('normal');
  const [financialIQ, setFinancialIQ] = useState({ level: 1, points: 0 });

  const challenges = {
    easy: [
      { task: "Track your expenses for a day", total: 1, points: 50, icon: CreditCard },
      { task: "Learn about one new financial term", total: 1, points: 50, icon: Briefcase },
      { task: "Set up a savings goal", total: 1, points: 50, icon: TrendingUp },
    ],
    normal: [
      { task: "Create a monthly budget", total: 5, points: 100, icon: TrendingUp },
      { task: "Research and compare two investment options", total: 2, points: 100, icon: DollarSign },
      { task: "Calculate your net worth", total: 1, points: 100, icon: Briefcase },
    ],
    hard: [
      { task: "Develop a 5-year savings plan", total: 1, points: 200, icon: Briefcase },
      { task: "Analyze and optimize your investment portfolio", total: 1, points: 200, icon: TrendingUp },
      { task: "Create a retirement savings strategy", total: 1, points: 200, icon: Award },
    ],
  };


  const selectChallenge = useCallback(() => {
    const selectedChallenges = challenges[difficultyLevel];
    return selectedChallenges[Math.floor(Math.random() * selectedChallenges.length)];
  }, [difficultyLevel]);

  useEffect(() => {
    const selectedChallenge = selectChallenge();
    setChallenge(selectedChallenge);
    setTimeLeft(3600);
  }, [selectChallenge]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      addNotification("Time's up! The challenge fades away. But fear not, a new adventure awaits tomorrow!");
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleProgress = () => {
    if (progress < challenge.total) {
      setProgress(progress + 1);
      if (progress + 1 === challenge.total) {
        setIsCompleted(true);
        setShowReward(true);
        setStreak(streak + 1);
        onComplete && onComplete();
        triggerConfetti();
      }
    }
  };

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);
  };

  const handleClaimReward = () => {
    setShowReward(false);
    const earnedPoints = challenge.points;
    setFinancialIQ(prev => {
      const newPoints = prev.points + earnedPoints;
      const pointsForNextLevel = prev.level * 100;
      if (newPoints >= pointsForNextLevel) {
        addNotification(`Level Up! Your Financial IQ is now level ${prev.level + 1}!`);
        return { level: prev.level + 1, points: newPoints - pointsForNextLevel };
      }
      return { ...prev, points: newPoints };
    });
    addNotification(`Great job! You've earned ${earnedPoints} Financial IQ Points!`);

    // Trigger a more elaborate confetti effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
      }));
      confetti(Object.assign({}, defaults, { 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
      }));
    }, 250);
  };

  const handleChangeDifficulty = (level) => {
    setDifficultyLevel(level);
    const newChallenge = challenges[level][Math.floor(Math.random() * challenges[level].length)];
    setChallenge(newChallenge);
    setProgress(0);
    setIsCompleted(false);
    setTimeLeft(3600);
    addNotification(`Difficulty changed to ${level}. A new challenge awaits!`);
  };

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-800 to-purple-800 p-4 sm:p-6 rounded-lg shadow-lg mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-bold flex items-center text-yellow-300 mb-2 sm:mb-0">
          <Calendar className="mr-2" size={24} />
          Dhan Gyan Daily Challenge
        </h3>
        <div className="flex items-center">
          <Clock className="mr-2" size={20} />
          <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <p className="text-lg text-gray-200 flex items-center mb-2 sm:mb-0">
          {challenge?.icon && <challenge.icon className="mr-2" size={24} />}
          {challenge?.task}
        </p>
        <div className="flex items-center">
          <Zap className="mr-2" size={20} />
          <span className="text-lg font-semibold text-yellow-300">Financial IQ: {financialIQ.level}</span>
        </div>
      </div>
      <div className="relative pt-1">
        <motion.div 
          className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            style={{ width: `${(progress / challenge?.total) * 100}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / challenge?.total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {!isCompleted && (
        <motion.button
          className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-2 px-4 rounded-full shadow-lg mb-4 sm:mb-0"
          onClick={handleProgress}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }}
        >
          Advance Quest
        </motion.button>
      )}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="flex items-center">
            <Award className="mr-2" size={20} />
            <span className="text-lg font-semibold text-yellow-300">Streak: {streak}</span>
          </div>
          <div className="flex items-center">
            <Shield className="mr-2" size={20} />
            <span className="text-lg font-semibold text-green-300">Level: {challenge?.level}</span>
          </div>
          <div className="flex items-center">
          <Award className="mr-2" size={20} />
          <span className="text-lg font-semibold text-yellow-300">{challenge?.points} Points</span>
        </div>
        </div>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-full ${difficultyLevel === 'easy' ? 'bg-green-500' : 'bg-gray-500'} text-white`}
            onClick={() => handleChangeDifficulty('easy')}
          >
            Easy 
          </button>
          <button 
            className={`px-4 py-2 rounded-full ${difficultyLevel === 'normal' ? 'bg-yellow-500' : 'bg-gray-500'} text-white`}
            onClick={() => handleChangeDifficulty('normal')}
            >
              Mild
            </button>
            <button 
              className={`px-4 py-2 rounded-full ${difficultyLevel === 'hard' ? 'bg-red-500' : 'bg-gray-500'} text-white`}
              onClick={() => handleChangeDifficulty('hard')}
            >
              Master
            </button>
          </div>
        </div>
        <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl text-center shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <ParticleAnimation isVisible={showReward} />
              <motion.div
                className="relative z-10"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
               <Gift className="mx-auto mb-6 text-purple-900" size={64} />
                <h4 className="text-3xl font-bold text-purple-900 mb-4">Financial Milestone Achieved!</h4>
                <p className="text-purple-900 mb-6 text-lg">You've mastered this financial challenge and earned a reward!</p>
                <motion.div className="flex justify-center space-x-4">
                  <PulsingButton
                    className="bg-purple-800 hover:bg-purple-900 text-yellow-400 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleClaimReward}
                  >
                    Claim Your Reward
                  </PulsingButton>
                  <motion.button
                    className="bg-transparent border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-yellow-400 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => setShowReward(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-2xl text-center shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <ParticleAnimation isVisible={showReward} />
              <motion.div
                className="relative z-10"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Gift className="mx-auto mb-6 text-purple-900" size={64} />
                <h4 className="text-3xl font-bold text-purple-900 mb-4">Legendary Achievement!</h4>
                <p className="text-purple-900 mb-6 text-lg">You've conquered the challenge and earned a mythical reward!</p>
                <motion.div className="flex justify-center space-x-4">
                  <motion.button
                    className="bg-purple-800 hover:bg-purple-900 text-yellow-400 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleClaimReward}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Claim Your Prize
                  </motion.button>
                  <motion.button
                    className="bg-transparent border-2 border-purple-800 text-purple-800 hover:bg-purple-800 hover:text-yellow-400 font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => setShowReward(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {notifications.map(({ id, message }) => (
          <motion.div
            key={id}
            className="fixed top-4 right-4 w-80 bg-black bg-opacity-70 text-white p-4 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -20, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <Bell className="mr-2 mt-1" size={16} />
                  <p>{message}</p>
                </div>
                <button 
                  onClick={() => removeNotification(id)}
                  className="ml-2 text-white hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };
  
  export default DailyChallenge;
  
