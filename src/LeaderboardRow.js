import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, Zap, Flame, Wind, Droplets, Award, ChevronDown } from 'lucide-react';

const CharacterIcon = ({ userType }) => {
  switch (userType) {
    case 'Student':
      return <Wind className="text-green-400" size={24} />;
    case 'Homemaker':
      return <Droplets className="text-blue-400" size={24} />;
    case 'Entrepreneur':
      return <Flame className="text-red-400" size={24} />;
    case 'Freelancer':
      return <Sparkles className="text-purple-400" size={24} />;
    case 'Employee':
      return <Zap className="text-yellow-400" size={24} />;
    default:
      return null;
  }
};

const MedalIcon = ({ rank }) => {
  const colors = ['text-yellow-400', 'text-gray-300', 'text-yellow-600'];
  return rank <= 3 ? (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Award className={`${colors[rank - 1]} absolute -top-2 -left-2`} size={30} />
    </motion.div>
  ) : null;
};

const QuestItem = ({ quest }) => {
  const progress = (quest.progress / quest.total) * 100;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{quest.name}</span>
        <span className="text-sm text-gray-400">{quest.progress}/{quest.total}</span>
      </div>
      <div className="bg-blue-700 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>XP: {quest.experience}</span>
        <span>Gold: {quest.goldReward}</span>
      </div>
    </div>
  );
};

const AchievementItem = ({ achievement }) => {
  const progress = (achievement.progress / achievement.total) * 100;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">{achievement.name}</span>
        <span className={`text-sm ${achievement.completed ? 'text-green-400' : 'text-gray-400'}`}>
          {achievement.completed ? 'Completed' : `${achievement.progress}/${achievement.total}`}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
      {!achievement.completed && (
        <div className="bg-green-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-yellow-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

const LeaderboardRow = ({ player, index, isExpanded, toggleExpand, onViewProfile }) => {
  const controls = useAnimation();
  const rowColors = [
    'from-purple-700 to-pink-700',
    'from-yellow-700 to-orange-700',
    'from-green-700 to-cyan-700',
    'from-red-700 to-pink-700',
    'from-blue-700 to-indigo-700',
  ];

  useEffect(() => {
    controls.start({
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12, delay: index * 0.1 }
    });
  }, [controls, index]);

  const completedAchievements = player.achievements.filter(a => a.completed).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      exit={{ opacity: 0, y: -50 }}
      className={`rounded-lg mb-2 overflow-hidden`}
    >
      <motion.div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r ${rowColors[index % rowColors.length]} shadow-lg hover:shadow-xl transition-all duration-300`}
        whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
          <motion.div 
            className="relative mr-4" 
            whileHover={{ rotateY: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            <MedalIcon rank={index + 1} />
            <span className="text-3xl font-bold bg-white text-black rounded-full w-10 h-10 flex items-center justify-center">
              {index + 1}
            </span>
          </motion.div>
          <CharacterIcon userType={player.userType} />
          <div className="ml-4">
            <h3 className="text-xl font-bold">{player.name}</h3>
            <p className="text-sm">{player.userType}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto">
          <motion.div className="mr-4 sm:mr-8 text-center mb-2 sm:mb-0" whileHover={{ scale: 1.1 }}>
            <p className="text-sm">Financial Literacy Score</p>
            <p className="text-2xl font-bold">{player.financialLiteracyScore}</p>
          </motion.div>
          <motion.div className="mr-4 sm:mr-8 text-center mb-2 sm:mb-0" whileHover={{ scale: 1.1 }}>
            <p className="text-sm">Completed Courses</p>
            <p className="text-2xl font-bold">{player.completedCourses}</p>
          </motion.div>
          <motion.div className="mr-4 sm:mr-8 text-center mb-2 sm:mb-0" whileHover={{ scale: 1.1 }}>
            <p className="text-sm">Achievements</p>
            <p className="text-2xl font-bold">{completedAchievements}</p>
          </motion.div>
          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-blue-500 rounded-full text-sm font-bold"
              onClick={() => onViewProfile(player)}
            >
              View Profile
            </motion.button>
            <motion.div 
              className="ml-4 cursor-pointer"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              onClick={() => toggleExpand(player.id)}
            >
              <ChevronDown size={24} />
            </motion.div>
          </div>
        </div>
      </motion.div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-gray-800 p-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Savings Amount</p>
              <p className="text-xl font-bold">₹{player.savingsAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Investment Knowledge</p>
              <p className="text-xl font-bold">{player.investmentKnowledge}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Age</p>
              <p className="text-xl font-bold">{player.age}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Active Quests</p>
            {player.quests.slice(0, 2).map(quest => (
              <QuestItem key={quest.id} quest={quest} />
            ))}
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Achievements</p>
            {player.achievements.slice(0, 3).map(achievement => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LeaderboardRow;