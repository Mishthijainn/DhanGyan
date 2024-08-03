import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, X, Gift, Clock } from 'lucide-react';

const DailyChallenge = ({ onComplete }) => {
  const [challenge, setChallenge] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    const challenges = [
      { task: "Defeat 10 monsters in the Dark Forest", total: 10 },
      { task: "Craft 5 epic items", total: 5 },
      { task: "Complete 3 quests in under an hour", total: 3 },
      { task: "Earn 1000 gold from trading", total: 1000 },
      { task: "Defeat a boss monster solo", total: 1 }
    ];
    const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(selectedChallenge);
    setTimeLeft(3600); // 1 hour in seconds
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
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
        onComplete && onComplete();
      }
    }
  };

  const handleClaimReward = () => {
    setShowReward(false);
    // Here you would typically update the player's inventory or stats
    console.log("Reward claimed!");
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-800 to-purple-800 p-6 rounded-lg shadow-lg mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold flex items-center text-yellow-300">
          <Calendar className="mr-2" size={24} />
          Daily Challenge
        </h3>
        <div className="flex items-center">
          <Clock className="mr-2" size={20} />
          <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <p className="text-lg text-gray-200 mb-4">{challenge?.task}</p>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-900">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-purple-200">
              {Math.round((progress / challenge?.total) * 100)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-900">
          <motion.div 
            style={{ width: `${(progress / challenge?.total) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / challenge?.total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      {!isCompleted && (
        <motion.button
          className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-2 px-4 rounded-full shadow-lg"
          onClick={handleProgress}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Progress Challenge
        </motion.button>
      )}
      {isCompleted && (
        <div className="flex items-center justify-center">
          <CheckCircle className="text-green-400 mr-2" size={24} />
          <span className="text-lg font-semibold text-green-400">Challenge Completed!</span>
        </div>
      )}
      <AnimatePresence>
        {showReward && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-yellow-400 p-6 rounded-lg text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Gift className="mx-auto mb-4 text-purple-800" size={48} />
              <h4 className="text-2xl font-bold text-purple-800 mb-2">Congratulations!</h4>
              <p className="text-purple-900 mb-4">You've earned a special reward!</p>
              <motion.button
                className="bg-purple-800 hover:bg-purple-900 text-yellow-400 font-bold py-2 px-4 rounded-full"
                onClick={handleClaimReward}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Claim Reward
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyChallenge;