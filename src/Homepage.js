import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Menu, X, ChevronRight, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Sparkles, Zap, Flame, Wind, Droplets, Award, ChevronDown, Star, Scroll, Trophy, Target, Calendar, Pencil, Milestone, Play, Share2 } from 'lucide-react';
import GuildSystem from './GuildSystem';
import DailyChallenge from './DailyChallenge.js';
import PlayerProfile from './PlayerProfile';
import TargetPractice from './FinancialQuiz.js';
import AIChat from './AIChat.js';
import LiveFileSharing from './LiveFileSharing.js';
import AIScribble from './AIScribble';
import LoginSignupPage from './LoginSignupPage.js';


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
    <h2 className="text-3xl font-bold mb-4 text-white">
      {`${words[index].substring(0, subIndex)}${subIndex === words[index].length ? '' : '|'}`}
    </h2>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500"></div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white opacity-10 animate-float"
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

const GlassCard = ({ children, className }) => {
  return (
    <div className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

const DhanGyanHomepage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginSignup, setShowLoginSignup] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const typewriterWords = [
    "Complete financial solution",
    "Personalized AI-powered courses",
    "Smart expense tracker",
    "Business platform",
    "Learn, develop, grow",
    "Live Teaching",
    "Be visible be Global",
    "Learn something new"
  ];

  return (
    <div className="font-sans min-h-screen text-white overflow-x-hidden relative">
      <AnimatedBackground />

      {/* Header */}
      <header className="bg-transparent p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 hover:text-yellow-300 transition-colors duration-300">
            <Menu size={24} />
          </button>
          <h1 className="text-4xl font-bold">Dhan Gyan</h1>
        </div>
        <div>
          <button onClick={() => setShowLoginSignup(true)} className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold mr-4 hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">Login</button>
          <button onClick={() => setShowLoginSignup(true)} className="bg-yellow-400 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105">Sign Up</button>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-blue-800 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="p-4">
          <button onClick={toggleSidebar} className="absolute top-4 right-4 hover:text-yellow-300 transition-colors duration-300">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-4">Menu</h2>
          <ul>
            {['About', 'Features', 'AI Section', 'Leaderboard', 'Learn', 'Skill Development', 'Courses', 'Marketplace', 'Community', 'Personalized Schemes', 'Financial Growth', 'Job Opportunities', 'Contact Us'].map((item) => (
              <li key={item} className="mb-2">
                <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-yellow-300 transition-colors duration-300 flex items-center">
                  <ArrowRight size={16} className="mr-2" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <section className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">Dhan Gyan</h1>
          <TypewriterEffect words={typewriterWords} />
          <p className="text-xl mb-8">Empowering women and youth with financial literacy</p>
          <button className="bg-yellow-400 text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 transform hover:scale-110 animate-pulse">Get Started</button>
        </section>

        {/* Guild System */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Join a Guild</h2>
          <GuildSystem />
        </GlassCard>

        {/* Daily Challenge */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Daily Challenge</h2>
          <DailyChallenge />
        </GlassCard>

        {/* Player Profile */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Your Profile</h2>
          <PlayerProfile />
        </GlassCard>

        {/* Target Practice (Fruit Ninja) */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Target Practice</h2>
          <TargetPractice />
        </GlassCard>

        {/* Live File Sharing */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Share Files</h2>
          <LiveFileSharing />
        </GlassCard>

        {/* AI Scribble */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">AI Scribble</h2>
          <AIScribble />
        </GlassCard>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {['AI-Powered Learning', 'Personalized Schemes', 'Community Support', 'Financial Growth', 'Job Opportunities', 'Skill Development'].map((feature, index) => (
            <GlassCard key={feature} className={`hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <h3 className="text-xl font-semibold mb-2">{feature}</h3>
              <p className="text-gray-200 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <a href="#" className="text-yellow-300 inline-flex items-center hover:text-white transition-colors duration-300">
                Learn more <ChevronRight size={16} className="ml-1" />
              </a>
            </GlassCard>
          ))}
        </section>

        {/* About Section */}
        <GlassCard className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">About Dhan Gyan</h2>
          <p className="text-lg">Dhan Gyan is a comprehensive financial literacy platform designed to empower women and young individuals with the knowledge and tools they need to achieve financial success.</p>
        </GlassCard>

        {/* Learn Section */}
        <section id="learn" className="mb-12 animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Learn with Dhan Gyan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Budgeting Basics', 'Investment Strategies', 'Credit Management', 'Tax Planning'].map((course, index) => (
              <GlassCard key={course} className={`hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105`} style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className="text-xl font-semibold mb-2">{course}</h3>
                <p className="text-gray-200 mb-4">Master the essentials of {course.toLowerCase()}.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">Enroll Now</button>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <GlassCard className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-4">Connect with like-minded individuals, share experiences, and grow together.</p>
          <button className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110">Join Community</button>
        </GlassCard>



        {/* Contact & Social */}
        <GlassCard className="text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg mb-4">Have questions? We're here to help!</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 mb-6">Contact Us</button>
          <div className="flex justify-center space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <a key={index} href="#" className="text-white hover:text-yellow-300 transition-colors duration-300 transform hover:scale-125">
                <Icon size={24} />
              </a>
            ))}
          </div>
        </GlassCard>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 bg-opacity-50 text-white p-4 text-center mt-12">
        <p>&copy; 2024 Dhan Gyan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DhanGyanHomepage;