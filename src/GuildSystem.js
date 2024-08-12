import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, TrendingUp, PiggyBank, Award } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const FinancialEmblem = ({ color, icon: Icon }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    mesh.current.rotation.y = Math.cos(state.clock.elapsedTime) * 0.2;
    mesh.current.scale.set(
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.05,
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.05,
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    );
  });

  return (
    <group 
      ref={mesh}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          metalness={0.7} 
          roughness={0.2} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {Icon.name}
      </Text>
    </group>
  );
};

const FinancialCommunityCard = ({ community, onJoin, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-lg ${isActive ? 'ring-2 ring-yellow-400' : ''}`}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-800 z-0" />
      <div className="relative z-10 h-48">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FinancialEmblem color={community.color} icon={community.icon} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Environment preset="sunset" />
        </Canvas>
      </div>
      <div className="relative z-20 p-4 text-white">
        <h4 className="text-xl font-bold mb-2">{community.name}</h4>
        <p className="text-sm mb-2 flex items-center">
          <Users className="mr-2" size={14} /> Members: {community.members}
        </p>
        <p className="text-sm mb-2 flex items-center">
          <BookOpen className="mr-2" size={14} /> Focus: {community.focus}
        </p>
        <p className="text-sm mb-4 flex items-center">
          <TrendingUp className="mr-2" size={14} /> Level: {community.level}
        </p>
        <motion.button
          onClick={() => setShowJoinModal(true)}
          className="relative z-30 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Community
        </motion.button>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-75 z-25 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white text-center">{community.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl max-w-md w-full text-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Join {community.name}</h3>
              <p className="text-center mb-6">Are you ready to boost your financial literacy with this community?</p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    onJoin(community);
                    setShowJoinModal(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </motion.button>
                <motion.button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowJoinModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FinancialLiteracyCommunity = ({ player, onJoinGuild, onLeaveGuild }) => {
  const [communities, setCommunities] = useState([
    { id: 1, name: "Savings Champions", members: 523, focus: "Budgeting & Saving", level: "Beginner", color: "#4CAF50", icon: PiggyBank, description: "Master the art of budgeting and grow your savings!" },
    { id: 2, name: "Investment Wizards", members: 412, focus: "Investing", level: "Intermediate", color: "#2196F3", icon: TrendingUp, description: "Learn investment strategies and grow your wealth." },
    { id: 3, name: "Financial Freedom Seekers", members: 378, focus: "Debt Management", level: "Advanced", color: "#9C27B0", icon: Award, description: "Tackle debt and pave your way to financial independence." },
  ]);
  const [playerCommunity, setPlayerCommunity] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveCommunity((prev) => (prev + 1) % communities.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [communities.length]);

  const handleJoinCommunity = (community) => {
    setPlayerCommunity(community);
    onJoinGuild(community);
    clearInterval(intervalRef.current);
    setShowConfirmation(true);
  };

  const handleLeaveCommunity = () => {
    setPlayerCommunity(null);
    onLeaveGuild(); // Fixed: Changed onLeaveCommunity to onLeaveGuild
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-900 to-purple-800 p-6 rounded-2xl mb-8 shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        <Users className="mr-3" size={28} />
        Financial Literacy Communities
      </h3>
      <AnimatePresence mode='wait'>
        {playerCommunity ? (
          <motion.div
            key="player-community"
            className="bg-white bg-opacity-10 p-8 rounded-xl mb-6 shadow-inner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Canvas className="w-full h-64 mb-6">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <FinancialEmblem color={playerCommunity.color} icon={playerCommunity.icon} />
              <Environment preset="sunset" />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <h4 className="text-3xl font-bold mb-4 text-center text-white">{playerCommunity.name}</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Users className="mx-auto mb-2 text-green-400" size={24} />
                <p className="text-sm text-gray-300">Members</p>
                <p className="text-xl font-bold text-white">{playerCommunity.members}</p>
              </div>
              <div className="text-center">
                <BookOpen className="mx-auto mb-2 text-blue-400" size={24} />
                <p className="text-sm text-gray-300">Focus</p>
                <p className="text-xl font-bold text-white">{playerCommunity.focus}</p>
              </div>
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 text-purple-400" size={24} />
                <p className="text-sm text-gray-300">Level</p>
                <p className="text-xl font-bold text-white">{playerCommunity.level}</p>
              </div>
            </div>
            <p className="text-center mb-6 text-white">{playerCommunity.description}</p>
            <motion.button
              onClick={handleLeaveCommunity}
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Leave Community
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="community-selection"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {communities.map((community, index) => (
              <FinancialCommunityCard
                key={community.id}
                community={community}
                onJoin={handleJoinCommunity}
                isActive={index === activeCommunity}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-xl max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-gray-800">Welcome to {playerCommunity.name}!</h3>
              <p className="text-xl text-gray-600 mb-6">You've joined a community of financial learners. Get ready to boost your financial literacy!</p>
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfirmation(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Financial Journey
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FinancialLiteracyCommunity;