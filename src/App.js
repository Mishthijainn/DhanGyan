import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Sparkles, Zap, Flame, Wind, Droplets, Award, ChevronDown, Star, Scroll, Trophy, Target, Calendar, Pencil, Share2, UserPlus } from 'lucide-react';
import GuildSystem from './GuildSystem';
import DailyChallenge from './DailyChallenge';
import PlayerProfile from './PlayerProfile';
import FinancialQuiz from './FinancialQuiz';
import AIChat from './AIChat';
import LiveFileSharing from './LiveFileSharing';
import AIScribble from './AIScribble';
import LoginSignupPage from './LoginSignupPage';
import LeaderboardRow from './LeaderboardRow';
import FinancialLiteracyLearning from './FinancialLiteracyLearning.js';
import StyledButton from './StyledButton'; 

const TypewriterEffect = ({ words }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1000 : 150, parseInt(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <h2 className="text-4xl font-bold mb-4 text-white">
      {`${words[index].substring(0, subIndex)}${subIndex === words[index].length ? '' : '|'}`}
    </h2>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500"></div>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-10"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
          }}
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            x: [0, Math.random() * window.innerWidth],
            y: [0, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        ></motion.div>
      ))}
    </div>
  );
};

const GlassCard = ({ children, className }) => {
  return (
    <motion.div
      className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
};

const DhanGyanHomepage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginSignup, setShowLoginSignup] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState('score');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showFinancialQuiz, setShowFinancialQuiz] = useState(false);
  const [playerGuild, setPlayerGuild] = useState(null);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [showAIScribble, setShowAIScribble] = useState(false);
  const [isFileSharingOpen, setIsFileSharingOpen] = useState(false);
  const [showFinancialLearning, setShowFinancialLearning] = useState(false);

  useEffect(() => {
    setPlayers(generateRandomData());
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGovernmentSchemesClick = () => {
    window.open('https://www.myscheme.gov.in/find-scheme', '_blank');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginSignup(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        score: updatedPlayers[0].score + 1000,
      };
      return updatedPlayers;
    });
  };

  const handleQuizScore = (score) => {
    console.log(`Financial Quiz score: ${score}`);
    setShowFinancialQuiz(false);
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        score: updatedPlayers[0].score + score,
      };
      return updatedPlayers;
    });
  };

  const handleJoinGuild = (community) => {
    console.log(`Joined community: ${community.name}`);
    setPlayerGuild(community);
  };

  const handleLeaveGuild = () => {
    setPlayerGuild(null);
  };

  const handleAIScribbleScore = (score) => {
    console.log(`AI Scribble score: ${score}`);
    setShowAIScribble(false);
    setPlayers(prevPlayers => {
      const updatedPlayers = [...prevPlayers];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        score: updatedPlayers[0].score + score,
      };
      return updatedPlayers;
    });
  };

  const typewriterWords = [
    "Complete financial solution",
    "Personalized AI-powered courses",
    "Smart expense tracker",
    "Business platform",
    "Learn, develop, grow",
    "Live Teaching",
    "Be visible be Global",
    "Learn something new" ,
    "Get the best job",
    "Financial Literacy",
    "Financial Freedom",
    "Financial Growth",
    "Financial Planning",
    "Financial Management",
    "Financial Education",
    "Financial Independence",
    "Financial Stability",
    "Financial Security",
    "Financial Empowerment",
    "Financial Inclusion",
    "Financial Wellness",
    "Financial Success",
    "Financial Knowledge",
    "Financial Intelligence",
    "Financial Skills",
    "Financial Confidence",
    "Because if we dont who will ?",
    "Get in shape,Get that money,Get that job", 
  ];

  const generateRandomData = () => {
    const userTypes = ['Student', 'Homemaker', 'Entrepreneur', 'Freelancer', 'Employee'];
    const quests = [
      { id: 1, name: "Budgeting Basics", experience: 100, goldReward: 50, progress: 0, total: 10 },
      { id: 2, name: "Investment Fundamentals", experience: 150, goldReward: 75, progress: 0, total: 15 },
      { id: 3, name: "Credit Management", experience: 200, goldReward: 100, progress: 0, total: 20 },
    ];
    const achievements = [
      { id: 1, name: "Savings Star", description: "Save 10% of income for 3 months", progress: 0, total: 3, completed: false },
      { id: 2, name: "Budget Master", description: "Stick to budget for 6 months", progress: 0, total: 6, completed: false },
      { id: 3, name: "Investment Guru", description: "Diversify portfolio with 5 types of investments", progress: 0, total: 5, completed: false },
      { id: 4, name: "Debt Destroyer", description: "Pay off all high-interest debt", progress: 0, total: 1, completed: false },
      { id: 5, name: "Financial Planner", description: "Create a 5-year financial plan", progress: 0, total: 1, completed: false },
    ];
  
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      age: Math.floor(Math.random() * 40) + 15,
      gender: Math.random() > 0.5 ? 'Female' : 'Male',
      userType: userTypes[Math.floor(Math.random() * userTypes.length)],
      financialLiteracyScore: Math.floor(Math.random() * 100),
      completedCourses: Math.floor(Math.random() * 10),
      savingsAmount: Math.floor(Math.random() * 50000),
      investmentKnowledge: Math.floor(Math.random() * 100),
      quests: quests.map(quest => ({ ...quest, progress: Math.floor(Math.random() * quest.total) })),
      achievements: achievements.map(achievement => ({
        ...achievement,
        progress: Math.floor(Math.random() * achievement.total),
        completed: Math.random() > 0.7
      }))
    }));
  };

  return (
    <div className="font-sans min-h-screen text-white overflow-x-hidden relative">
      <AnimatedBackground />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-transparent p-4 flex justify-between items-center z-50"
      >
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="mr-4 hover:text-yellow-300 transition-colors duration-300"
          >
            <Menu size={24} />
          </motion.button>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold"
          >
            Dhan Gyan
          </motion.h1>
        </div>
        <div>
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold mr-4 hover:bg-yellow-300 transition-all duration-300"
            >
              Logout
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginSignup(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold mr-4 hover:bg-yellow-300 transition-all duration-300"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginSignup(true)}
                className="bg-yellow-400 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full bg-blue-800 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white w-64 z-50"
      >
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="absolute top-4 right-4 hover:text-yellow-300 transition-colors duration-300"
          >
            <X size={24} />
          </motion.button>
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            {['About', 'Features', 'AI Learning', 'Leaderboard', 'Courses', 'Financial Tools', 'Community', 'Contact Us'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-2"
              >
                <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-yellow-300 transition-colors duration-300 flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  {item}
                </a>
              </motion.li>
            ))}
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-2"
            >
              <button 
                onClick={handleGovernmentSchemesClick}
                className="hover:text-yellow-300 transition-colors duration-300 flex items-center w-full text-left"
              >
                <ArrowRight size={16} className="mr-2" />
                Government Schemes
              </button>
            </motion.li>
          </ul>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">Dhan Gyan</h1>
          <TypewriterEffect words={typewriterWords} />
          <p className="text-xl mb-8">Empowering women and youth with financial literacy</p>
          <StyledButton 
  text="Start Your Financial Journey" 
  onClick={() => {
    // Add your onClick handler here
    console.log("Button clicked!");
  }} 
/>
        </motion.section>

        {/* About Dhan Gyan Section */}
        <GlassCard className="mb-12">
          <h2 className="text-3xl font-bold mb-4">About Dhan Gyan</h2>
          <p className="text-lg mb-4">
            Dhan Gyan is a revolutionary platform designed to empower individuals with financial knowledge and skills. Our mission is to bridge the gap in financial literacy, especially for women and youth, by providing accessible, engaging, and personalized learning experiences.
          </p>
          <p className="text-lg mb-4">
            Through innovative AI-powered courses, interactive challenges, and a supportive community, we aim to equip our users with the tools they need to make informed financial decisions and achieve financial independence. Whether you're just starting your financial journey or looking to expand your knowledge, Dhan Gyan is here to guide you every step of the way.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Learn More About Us
          </motion.button>
        </GlassCard>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {[
            { name: 'AI-Powered Learning', icon: Zap, description: 'Personalized financial education with AI assistance' },
            { name: 'Government Schemes', icon: Target, description: 'Access to relevant financial schemes and programs', onClick: handleGovernmentSchemesClick },
            { name: 'Community Support', icon: UserPlus, description: 'Connect with peers and mentors for guidance' },
            { name: 'Financial Growth', icon: Flame, description: 'Track your progress and grow your wealth' },
            { name: 'Skill Enhancement', icon: Award, description: 'Develop crucial financial management skills' },
            { name: 'Interactive Tools', icon: Sparkles, description: 'Engage with simulations and real-world scenarios' }
          ].map((feature, index) => (
            <GlassCard key={feature.name} className="hover:bg-opacity-20 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon size={24} className="mb-2 text-yellow-300" />
                <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-200 mb-4">{feature.description}</p>
                {feature.onClick ? (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={feature.onClick}
                    className="text-yellow-300 inline-flex items-center hover:text-white transition-colors duration-300"
                  >
                    Learn more <ChevronRight size={16} className="ml-1" />
                  </motion.button>
                ) : (
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#" 
                    className="text-yellow-300 inline-flex items-center hover:text-white transition-colors duration-300"
                  >
                    Learn more <ChevronRight size={16} className="ml-1" />
                  </motion.a>
                )}
              </motion.div>
            </GlassCard>
          ))}
        </motion.section>

        {/* Financial Community */}
        <GlassCard className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Join a Financial Community</h2>
          <GuildSystem onJoinGuild={handleJoinGuild} onLeaveGuild={handleLeaveGuild} />
        </GlassCard>

        {/* Daily Financial Challenge */}
        <GlassCard className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Daily Financial Challenge</h2>
          <DailyChallenge onComplete={handleChallengeComplete} />
        </GlassCard>

        {/* Leaderboard */}
        <GlassCard className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Leaderboard</h2>
          <div className="flex flex-wrap justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy('score')}
              className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-l-full font-bold text-sm sm:text-base ${
                sortBy === 'score' ? 'bg-purple-600' : 'bg-gray-700'
              } transition-colors duration-300`}
            >
              <Star className="mr-2" size={16} /> Score
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy('wins')}
              className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 font-bold text-sm sm:text-base ${
                sortBy === 'wins' ? 'bg-pink-600' : 'bg-gray-700'
              } transition-colors duration-300`}
            >
              <Flame className="mr-2" size={16} /> Wins
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy('achievements')}
              className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-r-full font-bold text-sm sm:text-base ${
                sortBy === 'achievements' ? 'bg-yellow-600' : 'bg-gray-700'
              } transition-colors duration-300`}
            >
              <Trophy className="mr-2" size={16} /> Achievements
            </motion.button>
          </div>
          {players.length > 0 ? (
            players.slice(0, 5).map((player, index) => (
              <LeaderboardRow 
                key={player.id} 
                player={player} 
                index={index} 
                isExpanded={expandedId === player.id}
                toggleExpand={toggleExpand}
                onViewProfile={handleViewProfile}
              />
            ))
          ) : (
            <p>Loading leaderboard data...</p>
          )}
          <div className="text-center mt-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              View Full Leaderboard
            </motion.button>
          </div>
        </GlassCard>

        {/* Interactive Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4">Financial Quiz</h3>
            <p className="mb-4">Test your financial knowledge and earn points!</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFinancialQuiz(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Take Financial Quiz
            </motion.button>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4">Virtual Reality (VR) Financial Simulations</h3>
            <p className="mb-4">Experience the Wholesome Virtual Reality</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIScribble(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Plan Budget
            </motion.button>
          </GlassCard>
          
          <GlassCard>
            <h3 className="text-2xl font-bold mb-4">Resource Sharing</h3>
            <p className="mb-4">Share financial resources with your community!</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFileSharingOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Share Resources
            </motion.button>
          </GlassCard>
        </motion.section>

        {/* Financial Literacy Learning Section */}
        <GlassCard className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Financial Literacy Learning</h2>
          <p className="text-lg mb-4">Enhance your financial knowledge with our interactive courses.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFinancialLearning(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Start Learning
          </motion.button>
        </GlassCard>

        {/* Community Section */}
        <GlassCard className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Financial Community</h2>
          <p className="text-lg mb-4">Connect with peers, share experiences, and grow your financial knowledge together.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-600 transition-all duration-300"
          >
            Join Community
          </motion.button>
        </GlassCard>

        {/* Contact & Social */}
        <GlassCard className="text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-4">Have questions? We're here to help!</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 mb-6"
          >
            Contact Us
          </motion.button>
          <div className="flex justify-center space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <motion.a 
                key={index} 
                href="#" 
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-yellow-300 transition-colors duration-300"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 bg-opacity-50 text-white p-4 text-center mt-12">
        <p>&copy; 2024 Dhan Gyan. All rights reserved.</p>
      </footer>

      {/* Modals and Popups */}
      <AnimatePresence>
        {showLoginSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <LoginSignupPage
                onLogin={handleLogin}
                onClose={() => setShowLoginSignup(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFinancialLearning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4">
              <button 
                onClick={() => setShowFinancialLearning(false)}
                className="float-right text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
              <FinancialLiteracyLearning />
            </div>
          </motion.div>
        </motion.div>
      )}

      {showFinancialQuiz && (
        <FinancialQuiz 
          onClose={() => setShowFinancialQuiz(false)} 
          onScoreUpdate={handleQuizScore}
          userProfile={players[0]} // Assuming the first player is the current user
        />
      )}

      {showAIScribble && (
        <AIScribble onClose={() => setShowAIScribble(false)} onScoreUpdate={handleAIScribbleScore} />
      )}

      {isFileSharingOpen && (
        <LiveFileSharing 
          isOpen={isFileSharingOpen} 
          onClose={() => setIsFileSharingOpen(false)}
        />
      )}

      {selectedPlayer && (
        <PlayerProfile player={selectedPlayer} onClose={handleCloseProfile} />
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <AIChat />
      </div>
    </div>
  );
};

export default DhanGyanHomepage;