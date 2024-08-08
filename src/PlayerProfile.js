import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Flame, Wind, Droplets, Award, Star, Scroll, Trophy, Target, CheckCircle, Milestone, Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';


const CharacterIcon = ({ character }) => {
  switch (character) {
    case 'Wizard': return <Sparkles className="text-purple-400" size={24} />;
    case 'Archer': return <Wind className="text-green-400" size={24} />;
    case 'Warrior': return <Zap className="text-yellow-400" size={24} />;
    case 'Rogue': return <Flame className="text-red-400" size={24} />;
    case 'Cleric': return <Droplets className="text-blue-400" size={24} />;
    default: return null;
  }
};

const PlayerProfile = ({ player, onClose, friends = [] }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const [isLoading, setIsLoading] = useState(true);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const tabVariants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.1, opacity: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getStatsData = (playerData) => [
    { stat: 'Level', A: playerData.level, fullMark: 50 },
    { stat: 'Experience', A: playerData.experience / 20, fullMark: 50 },
    { stat: 'Gold', A: playerData.goldCoins / 100, fullMark: 50 },
    { stat: 'Wins', A: playerData.wins, fullMark: 50 },
    { stat: 'Score', A: playerData.score / 200, fullMark: 50 },
  ];

  const playerStatsData = getStatsData(player);

  const LoadingScreen = () => (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.h2
        className="mt-4 text-xl font-bold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Loading Profile
      </motion.h2>
    </motion.div>
  );
  const CompareSection = () => {
    if (friends.length === 0) {
      return (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-400">No friends available for comparison.</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="mt-4 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {!compareMode ? (
          <motion.button
            onClick={() => setCompareMode(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="mr-1" size={16} />
            Compare with Friends
          </motion.button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm w-full sm:w-auto"
              onChange={(e) => setSelectedFriend(friends.find(f => f.id === e.target.value))}
              value={selectedFriend?.id || ''}
            >
              <option value="">Select a friend</option>
              {friends.map(friend => (
                <option key={friend.id} value={friend.id}>{friend.name}</option>
              ))}
            </select>
            <motion.button
              onClick={() => {
                setCompareMode(false);
                setSelectedFriend(null);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Exit Compare Mode
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div 
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-8 rounded-xl max-w-lg mx-auto my-4 relative shadow-2xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <AnimatePresence>
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <>
              <motion.button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              <motion.div 
                className="flex items-center mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <CharacterIcon character={player.character} />
                  </motion.div>
                  <motion.div 
                    className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                  >
                    <Trophy size={16} />
                  </motion.div>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {player.name}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300">Level {player.level} {player.character}</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex mb-4 bg-gray-800 bg-opacity-50 rounded-lg p-1 overflow-x-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {['stats', 'quests', 'achievements', 'timeline', 'guild'].map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 py-1 rounded-lg text-sm sm:text-base whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600' : ''}`}
                    variants={tabVariants}
                    initial="inactive"
                    animate={activeTab === tab ? "active" : "inactive"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
                >
                  {activeTab === 'stats' && (
                    <div className="flex flex-col items-center">
                      <div className="grid grid-cols-2 gap-2 mb-4 w-full">
                        {[
                          { label: 'Character', value: player.character, icon: CharacterIcon },
                          { label: 'Level', value: player.level, icon: Star },
                          { label: 'Score', value: player.score, icon: Target },
                          { label: 'Wins', value: player.wins, icon: Trophy }
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            className="bg-gray-700 p-2 rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <p className="text-xs text-gray-400">{stat.label}</p>
                            <div className="flex items-center">
                              <stat.icon character={stat.value} size={16} className="mr-1" />
                              <p className="text-sm font-bold">{stat.value}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full h-48 sm:h-64"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart outerRadius="80%" data={playerStatsData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="stat" />
                            <PolarRadiusAxis angle={30} domain={[0, 50]} />
                            <Radar name={player.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div>
                  )}
                  {activeTab === 'quests' && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold mb-2">Active Quests</h3>
                      {player.quests.map((quest, index) => (
                        <motion.div 
                          key={quest.id} 
                          className="bg-gray-700 p-3 rounded-lg"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm">{quest.name}</span>
                            <span className="text-xs text-gray-400">{quest.progress}/{quest.total}</span>
                          </div>
                          <div className="bg-gray-600 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="bg-indigo-500 h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>XP: {quest.experience}</span>
                            <span>Gold: {quest.goldReward}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'achievements' && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold mb-2">Achievements</h3>
                      {player.achievements.map((achievement, index) => (
                        <motion.div 
                          key={achievement.id} 
                          className="bg-gray-700 p-3 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm">{achievement.name}</span>
                            <span className={`text-xs ${achievement.completed ? 'text-green-400' : 'text-gray-400'}`}>
                              {achievement.completed ? <CheckCircle size={12} /> : `${achievement.progress}/${achievement.total}`}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">{achievement.description}</p>
                          {!achievement.completed && (
                            <div className="bg-gray-600 h-2 rounded-full overflow-hidden">
                              <motion.div
                                className="bg-yellow-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'timeline' && (
                    <div>
                      <h3 className="text-lg font-bold mb-2">Player Journey</h3>
                      <div className="relative">
                        {[
                          { icon: Scroll, text: "Joined the game", date: "2023-01-15" },
                          { icon: Zap, text: "Reached level 10", date: "2023-02-03" },
                          { icon: Trophy, text: "First quest completed", date: "2023-02-10" },
                          { icon: Milestone, text: "Joined a guild", date: "2023-03-01" },
                        ].map((milestone, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start mb-4 relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                          >
                           <motion.div 
                className="bg-indigo-500 rounded-full p-1 mr-3 z-10"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <milestone.icon size={16} />
              </motion.div>
              <div className="bg-gray-700 p-2 rounded-lg flex-grow">
                <p className="font-semibold text-sm">{milestone.text}</p>
                <p className="text-xs text-gray-400">{milestone.date}</p>
              </div>
              {index < 3 && (
                <motion.div 
                  className="absolute top-8 bottom-0 left-3 w-0.5 bg-indigo-500"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )}
    {activeTab === 'guild' && (
      <div>
        <h3 className="text-lg font-bold mb-2">Guild Information</h3>
        {player.guild ? (
          <motion.div 
            className="bg-gray-700 p-3 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex items-center mb-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <Award size={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-base font-semibold">{player.guild.name}</h4>
                <p className="text-xs text-gray-400">Rank: {player.guild.rank}</p>
              </div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-2 mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-800 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Members</p>
                <p className="text-sm font-bold">{player.guild.members}</p>
              </div>
              <div className="bg-gray-800 p-2 rounded-lg">
                <p className="text-xs text-gray-400">Specialty</p>
                <p className="text-sm font-bold">{player.guild.specialty}</p>
              </div>
            </motion.div>
            <motion.div 
              className="mt-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h5 className="font-semibold text-sm mb-1">Guild Perks</h5>
              <ul className="list-disc list-inside text-xs text-gray-300">
                <li>10% bonus XP for all members</li>
                <li>Access to exclusive guild quests</li>
                <li>Shared resource bank</li>
              </ul>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-4"
          >
            <p className="text-sm mb-3">This player is not part of any guild.</p>
            <motion.button
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find a Guild
            </motion.button>
          </motion.div>
        )}
      </div>
    )}
  </motion.div>
</AnimatePresence>

<motion.div
  className="mt-4 flex justify-center items-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8 }}
>
  {!compareMode ? (
    <motion.button
      onClick={() => setCompareMode(true)}
      className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Users className="mr-1" size={16} />
      Compare with Friends
    </motion.button>
  ) : (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
      <select
        className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm w-full sm:w-auto"
        onChange={(e) => setSelectedFriend(friends.find(f => f.id === e.target.value))}
        value={selectedFriend?.id || ''}
      >
        <option value="">Select a friend</option>
        {friends.map(friend => (
          <option key={friend.id} value={friend.id}>{friend.name}</option>
        ))}
      </select>
      <motion.button
        onClick={() => {
          setCompareMode(false);
          setSelectedFriend(null);
        }}
        className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors w-full sm:w-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Exit Compare Mode
      </motion.button>
    </div>
  )}
</motion.div>

<motion.div
  className="mt-3 text-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1 }}
>
  <p className="text-xs text-gray-400 mb-1">Player Status</p>
  <div className="inline-flex items-center bg-green-500 px-2 py-1 rounded-full">
    <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
    <span className="text-white text-xs font-semibold">Online</span>
  </div>
</motion.div>
</>
)}
</AnimatePresence>
</motion.div>
</motion.div>
);
};

export default PlayerProfile;