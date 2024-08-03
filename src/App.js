import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles, Zap, Flame, Wind, Droplets, Award, ChevronDown, Star, X, Scroll, Trophy, Target, Calendar, CheckCircle, Milestone } from 'lucide-react';
import GuildSystem from './GuildSystem';
import DailyChallenge from './DailyChallenge.js';
import PlayerProfile from './PlayerProfile';
import TargetPractice from './FruitNinja.js';
import AIChat from './AIChat';



const PlayerTimeline = ({ player }) => {
  const milestones = [
    { icon: Scroll, text: "Joined the game", date: "2023-01-15" },
    { icon: Zap, text: "Reached level 10", date: "2023-02-03" },
    { icon: Trophy, text: "First quest completed", date: "2023-02-10" },
    { icon: Milestone, text: "Joined a guild", date: "2023-03-01" },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Player Journey</h3>
      <div className="relative">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            className="flex items-start mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-blue-500 rounded-full p-2 mr-4">
              <milestone.icon size={20} />
            </div>
            <div>
              <p className="font-semibold">{milestone.text}</p>
              <p className="text-sm text-gray-400">{milestone.date}</p>
            </div>
          </motion.div>
        ))}
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-blue-500 -z-10" />
      </div>
    </div>
  );
};
// game
const MiniGame = ({ onScoreUpdate }) => {
  const [isGameVisible, setIsGameVisible] = useState(false);

  const handleGameClose = () => {
    setIsGameVisible(false);
  };

  const handleGameOpen = () => {
    setIsGameVisible(true);
  };

  return (
    <>
      <button
        onClick={handleGameOpen}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
      >
        Play Fruit Ninja
      </button>
      <AnimatePresence>
        {isGameVisible && (
          <TargetPractice onClose={handleGameClose} onScoreUpdate={onScoreUpdate} />
        )}
      </AnimatePresence>
    </>
  );
};

const App = () => {
  const [players, setPlayers] = useState(generateRandomData());
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
  };

};
// main leaderboard file
const generateRandomData = () => {
  const characters = ['Wizard', 'Archer', 'Warrior', 'Rogue', 'Cleric'];
  const quests = [
    { id: 1, name: "Slay the Dragon", experience: 1000, goldReward: 500, progress: 0, total: 100 },
    { id: 2, name: "Explore the Ancient Ruins", experience: 750, goldReward: 300, progress: 0, total: 5 },
    { id: 3, name: "Craft a Legendary Weapon", experience: 1500, goldReward: 1000, progress: 0, total: 1 },
  ];
  const achievements = [
    { id: 1, name: "Dragon Slayer", description: "Slay 10 dragons", progress: 0, total: 10, completed: false },
    { id: 2, name: "Master Craftsman", description: "Craft 50 items", progress: 0, total: 50, completed: false },
    { id: 3, name: "Legendary Explorer", description: "Discover 100 locations", progress: 0, total: 100, completed: false },
    { id: 4, name: "Ultimate Speedrunner", description: "Complete the main quest in under 10 hours", progress: 0, total: 1, completed: false },
    { id: 5, name: "Potion Master", description: "Brew 200 potions", progress: 0, total: 200, completed: false },
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Player${i + 1}`,
    character: characters[Math.floor(Math.random() * characters.length)],
    score: Math.floor(Math.random() * 10000),
    wins: Math.floor(Math.random() * 100),
    level: Math.floor(Math.random() * 50) + 1,
    experience: Math.floor(Math.random() * 1000),
    goldCoins: Math.floor(Math.random() * 5000),
    quests: quests.map(quest => ({ ...quest, progress: Math.floor(Math.random() * quest.total) })),
    achievements: achievements.map(achievement => ({
      ...achievement,
      progress: Math.floor(Math.random() * achievement.total),
      completed: Math.random() > 0.7
    }))
  }));
};

const CharacterIcon = ({ character }) => {
  switch (character) {
    case 'Wizard':
      return <Sparkles className="text-purple-400" size={24} />;
    case 'Archer':
      return <Wind className="text-green-400" size={24} />;
    case 'Warrior':
      return <Zap className="text-yellow-400" size={24} />;
    case 'Rogue':
      return <Flame className="text-red-400" size={24} />;
    case 'Cleric':
      return <Droplets className="text-blue-400" size={24} />;
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
          <CharacterIcon character={player.character} />
          <div className="ml-4">
            <h3 className="text-xl font-bold">{player.name}</h3>
            <p className="text-sm">{player.character}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto">
          <motion.div className="mr-4 sm:mr-8 text-center mb-2 sm:mb-0" whileHover={{ scale: 1.1 }}>
            <p className="text-sm">Score</p>
            <p className="text-2xl font-bold">{player.score}</p>
          </motion.div>
          <motion.div className="mr-4 sm:mr-8 text-center mb-2 sm:mb-0" whileHover={{ scale: 1.1 }}>
            <p className="text-sm">Wins</p>
            <p className="text-2xl font-bold">{player.wins}</p>
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
      <AnimatePresence>
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
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-xl font-bold">{player.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="text-xl font-bold">{player.experience}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Gold Coins</p>
                <p className="text-xl font-bold">{player.goldCoins}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Active Quests</p>
              {player.quests.slice(0, 2).map(quest => (
                <QuestItem key={quest.id} quest={quest} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StarField = () => {
  const starRef = useRef(null);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 200;
      let i = 0;
      while (i < starCount) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starRef.current.appendChild(star);
        i++;
      }
    };

    generateStars();
  }, []);

  return <div ref={starRef} className="star-field absolute inset-0 overflow-hidden"></div>;
};

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (index.current < text.length) {
        setDisplayText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [text]);

  return <span>{displayText}</span>;
};



const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [playerGuild, setPlayerGuild] = useState(null);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);

  useEffect(() => {
    setPlayers(generateRandomData());
  }, []);



  const sortedPlayers = [...players].sort((a, b) => b[sortBy] - a[sortBy]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleViewProfile = (player) => {
    setSelectedPlayer(player);
  };

  const handleCloseProfile = () => {
    setSelectedPlayer(null);
  };

  const handleChallengeComplete = () => {
    console.log("Challenge completed!");
    setDailyChallengeCompleted(true);
    // Here you could update the player's score or add other rewards
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        score: updatedPlayers[0].score + 1000, // Add 1000 points for completing the daily challenge
      };
      return updatedPlayers;
    });
  };


  const handleMiniGameScore = (score) => {
    console.log(`Mini-game score: ${score}`);
    setShowMiniGame(false);
    // Update the player's score
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        score: updatedPlayers[0].score + score,
      };
      return updatedPlayers;
    });
  };

  const handleJoinGuild = (guild) => {
    setPlayerGuild(guild);
  };

  const handleLeaveGuild = () => {
    setPlayerGuild(null);
    // i might want to update the player's data or send this information to a server
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <StarField />
      <motion.div 
        className="bg-gray-800 bg-opacity-80 text-white p-4 sm:p-8 rounded-xl w-full max-w-4xl relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        >
          <TypewriterText text=" A     AYUSH Quest Leaderboard "/>
        </motion.h1>
        
        <DailyChallenge onComplete={handleChallengeComplete} />
        
        <GuildSystem 
          player={players[0]} // Assuming the first player is the current user
          onJoinGuild={handleJoinGuild}
          onLeaveGuild={handleLeaveGuild}
        />
        
        <div className="flex flex-wrap justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy('score')}
            className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-l-full font-bold text-sm sm:text-base ${
              sortBy === 'score' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <Star className="mr-2" size={16} /> Score
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy('wins')}
            className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 font-bold text-sm sm:text-base ${
              sortBy === 'wins' ? 'bg-pink-600' : 'bg-gray-700'
            }`}
          >
            <Flame className="mr-2" size={16} /> Wins
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortBy('achievements')}
            className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-r-full font-bold text-sm sm:text-base ${
              sortBy === 'achievements' ? 'bg-yellow-600' : 'bg-gray-700'
            }`}
          >
            <Trophy className="mr-2" size={16} /> Achievements
          </motion.button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMiniGame(true)}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Target className="mr-2" size={16} /> Play Target Practice
        </motion.button>
        
        <AnimatePresence>
          {sortedPlayers.map((player, index) => (
            <LeaderboardRow 
              key={player.id} 
              player={player} 
              index={index} 
              isExpanded={expandedId === player.id}
              toggleExpand={toggleExpand}
              onViewProfile={handleViewProfile}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerProfile player={selectedPlayer} onClose={handleCloseProfile} />
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showMiniGame && (
    <TargetPractice onClose={() => setShowMiniGame(false)} onScoreUpdate={handleMiniGameScore} />
  )}
</AnimatePresence>
      
      {/* Move the AIChat component outside the main content div and give it a higher z-index */}
      <div className="fixed bottom-4 right-4 z-50">
        <AIChat />
      </div>
    </div>
  );
};

export default Leaderboard;