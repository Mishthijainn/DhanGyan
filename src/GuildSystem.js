import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Trophy, Star } from 'lucide-react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Text, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

extend({ MeshStandardMaterial })

const GuildEmblem = ({ color, icon: Icon }) => {
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

const GuildCard = ({ guild, onJoin, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl shadow-lg ${isActive ? 'ring-2 ring-yellow-400' : ''}`}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0" />
      <div className="relative z-10 h-48">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GuildEmblem color={guild.color} icon={guild.icon} />
          <OrbitControls enableZoom={false} enablePan={false} />
          <Environment preset="sunset" />
        </Canvas>
      </div>
      <div className="relative z-20 p-4 text-white">
        <h4 className="text-xl font-bold mb-2">{guild.name}</h4>
        <p className="text-sm mb-2 flex items-center">
          <Users className="mr-2" size={14} /> Members: {guild.members}
        </p>
        <p className="text-sm mb-2 flex items-center">
          <Trophy className="mr-2" size={14} /> Rank: {guild.rank}
        </p>
        <p className="text-sm mb-4 flex items-center">
          <Star className="mr-2" size={14} /> Specialty: {guild.specialty}
        </p>
        <motion.button
          onClick={() => setShowJoinModal(true)}
          className="relative z-30 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Join Guild
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
            <p className="text-white text-center">{guild.description}</p>
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
              className="bg-gray-800 p-8 rounded-xl max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-center text-white">Join {guild.name}</h3>
              <p className="text-white text-center mb-6">Are you sure you want to join this guild?</p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    onJoin(guild);
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

const GuildSystem = ({ player, onJoinGuild, onLeaveGuild }) => {
  const [guilds, setGuilds] = useState([
    { id: 1, name: "Dragon Slayers", members: 42, rank: 1, specialty: "Boss Fights", color: "#FF4500", icon: Shield, description: "Masters of epic battles, we take down the mightiest foes!" },
    { id: 2, name: "Mystic Mages", members: 38, rank: 2, specialty: "Crafting", color: "#4B0082", icon: Star, description: "Weaving magic into every item, we create legendary artifacts." },
    { id: 3, name: "Shadow Assassins", members: 35, rank: 3, specialty: "PvP", color: "#2F4F4F", icon: Trophy, description: "Swift and deadly, we rule the battlefield with unmatched skill." },
  ]);
  const [playerGuild, setPlayerGuild] = useState(null);
  const [activeGuild, setActiveGuild] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveGuild((prev) => (prev + 1) % guilds.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [guilds.length]);

  const handleJoinGuild = (guild) => {
    setPlayerGuild(guild);
    onJoinGuild(guild);
    clearInterval(intervalRef.current);
    setShowConfirmation(true);
  };

  const handleLeaveGuild = () => {
    setPlayerGuild(null);
    onLeaveGuild();
  };

  return (
    <motion.div
      className="bg-gray-900 p-6 rounded-2xl mb-8 shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h3 className="text-2xl font-bold mb-6 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        <Shield className="mr-3" size={28} />
        Epic Guild Halls
      </h3>
      <AnimatePresence mode='wait'>
        {playerGuild ? (
          <motion.div
            key="player-guild"
            className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl mb-6 shadow-inner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Canvas className="w-full h-64 mb-6">
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <GuildEmblem color={playerGuild.color} icon={playerGuild.icon} />
              <Environment preset="sunset" />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
            <h4 className="text-3xl font-bold mb-4 text-center">{playerGuild.name}</h4>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <Users className="mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-300">Members</p>
                <p className="text-xl font-bold">{playerGuild.members}</p>
              </div>
              <div className="text-center">
                <Trophy className="mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-300">Rank</p>
                <p className="text-xl font-bold">{playerGuild.rank}</p>
              </div>
              <div className="text-center">
                <Star className="mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-300">Specialty</p>
                <p className="text-xl font-bold">{playerGuild.specialty}</p>
              </div>
            </div>
            <p className="text-center mb-6">{playerGuild.description}</p>
            <motion.button
              onClick={handleLeaveGuild}
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Leave Guild
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="guild-selection"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {guilds.map((guild, index) => (
              <GuildCard
                key={guild.id}
                guild={guild}
                onJoin={handleJoinGuild}
                isActive={index === activeGuild}
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
              className="bg-gray-800 p-8 rounded-xl max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-3xl font-bold mb-4 text-white">Congratulations!</h3>
              <p className="text-xl text-white mb-6">You've joined the {playerGuild.name} guild!</p>
              <motion.button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowConfirmation(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Adventure
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GuildSystem;